import React, { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function RepoGraph({ repos = [] }) {
  const fgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      setDimensions({
        width: Math.max(containerRef.current.clientWidth, 320),
        height: Math.max(containerRef.current.clientHeight, 600),
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const graphData = (() => {
    const count = repos.length;
    if (!count) return { nodes: [], links: [] };

    /*
     * IMPORTANT:
     * Use the array position as the graph identity.
     *
     * GitHub IDs are useful metadata, but they must not be used as the
     * force-graph node identity because an upstream duplicate/missing ID
     * can make react-force-graph resolve nodes incorrectly.
     */
    const nodes = repos.map((repo, index) => ({
      ...repo,
      graphId: `repo-${index}`,
      repoIndex: index,
    }));

    // Put every repository at a deterministic, visible starting position.
    // The force simulation is intentionally not used to move nodes around;
    // this guarantees that every repository remains visible.
    /*
     * Stable constellation layout:
     * - 6 nodes on an inner ring
     * - remaining nodes on an outer ring
     *
     * This keeps the graph visually interesting while guaranteeing that
     * every repository starts inside the visible canvas.
     */
    const radius = Math.min(
      Math.max(dimensions.width - 160, 280),
      Math.max(dimensions.height - 160, 440)
    ) * 0.36;

    const innerCount = Math.min(6, count);
    const outerCount = Math.max(count - innerCount, 0);

    nodes.forEach((node, index) => {
      if (index < innerCount) {
        const angle =
          -Math.PI / 2 + (index / Math.max(innerCount, 1)) * Math.PI * 2;

        node.x = Math.cos(angle) * radius * 0.52;
        node.y = Math.sin(angle) * radius * 0.52;
      } else {
        const outerIndex = index - innerCount;
        const angle =
          -Math.PI / 2 +
          (outerIndex / Math.max(outerCount, 1)) * Math.PI * 2;

        node.x = Math.cos(angle) * radius;
        node.y = Math.sin(angle) * radius;
      }
    });

    const links = [];

    const getScore = (a, b) => {
      const sharedLangs = (a.languages || []).filter((l) => (b.languages || []).includes(l)).length;
      const sharedTopics = (a.topics || []).filter((t) => (b.topics || []).includes(t)).length;
      const sharedTech = (a.tech || []).filter((t) => (b.tech || []).includes(t)).length;
      return sharedLangs * 2 + sharedTopics * 3 + sharedTech * 4;
    };

    // 1. Normal links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const score = getScore(nodes[i], nodes[j]);
        if (score > 0) {
          links.push({
            source: nodes[i].graphId,
            target: nodes[j].graphId,
            value: score,
          });
        }
      }
    }

    // Remember which repositories had NO real similarity links before
    // fallback/component edges are added. These repositories need multiple
    // visible relationships so they do not appear as floating satellites.
    const originalSimilarityDegree = new Map(nodes.map((node) => [node.graphId, 0]));
    links.forEach((link) => {
      originalSimilarityDegree.set(
        String(link.source),
        (originalSimilarityDegree.get(String(link.source)) || 0) + 1
      );
      originalSimilarityDegree.set(
        String(link.target),
        (originalSimilarityDegree.get(String(link.target)) || 0) + 1
      );
    });

    // 2. Connected components
    class UnionFind {
      constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
      }
      find(i) {
        if (this.parent[i] === i) return i;
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
      }
      union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
          this.parent[rootI] = rootJ;
          return true;
        }
        return false;
      }
    }

    const getComponents = () => {
      const uf = new UnionFind(nodes.length);
      const idToIndex = new Map(nodes.map((n, i) => [n.graphId, i]));
      
      links.forEach(link => {
        const sIdx = idToIndex.get(link.source);
        const tIdx = idToIndex.get(link.target);
        if (sIdx !== undefined && tIdx !== undefined) {
          uf.union(sIdx, tIdx);
        }
      });
      
      const componentsMap = new Map();
      for (let i = 0; i < nodes.length; i++) {
        const root = uf.find(i);
        if (!componentsMap.has(root)) componentsMap.set(root, []);
        componentsMap.get(root).push(nodes[i]);
      }
      return Array.from(componentsMap.values());
    };

    let components = getComponents();

    // 3. Connect components until 1 remains
    while (components.length > 1) {
      let bestEdge = null;
      let bestScore = -1;
      let bestTotalMeta = -1;
      
      const compA = components[0];
      
      for (let c = 1; c < components.length; c++) {
        const compB = components[c];
        
        for (const nodeA of compA) {
          for (const nodeB of compB) {
            const score = getScore(nodeA, nodeB);
            const totalMeta = 
              (nodeA.languages || []).length + (nodeA.topics || []).length + (nodeA.tech || []).length + 
              (nodeB.languages || []).length + (nodeB.topics || []).length + (nodeB.tech || []).length;
                              
            if (score > bestScore || (score === bestScore && totalMeta > bestTotalMeta)) {
              bestScore = score;
              bestTotalMeta = totalMeta;
              bestEdge = { 
                source: nodeA.graphId, 
                target: nodeB.graphId, 
                value: 0.25, 
                fallback: true 
              };
            }
          }
        }
      }
      
      if (bestEdge) {
        links.push(bestEdge);
      } else {
        break; // Safety against infinite loop
      }
      
      components = getComponents();
    }

    // Reinforce repositories that had NO ORIGINAL similarity links.
    // Important: use originalSimilarityDegree here, not the current degree,
    // because the component-joining step above already gives an isolated
    // repository one fallback edge. We still want 2 additional meaningful
    // connections so it visibly belongs to the constellation.
    const existingPairs = new Set(
      links.map((link) => {
        const a = String(link.source);
        const b = String(link.target);
        return a < b ? `${a}|${b}` : `${b}|${a}`;
      })
    );

    nodes.forEach((isolatedNode) => {
      if ((originalSimilarityDegree.get(isolatedNode.graphId) || 0) !== 0) return;

      const candidates = nodes
        .filter((candidate) => candidate.graphId !== isolatedNode.graphId)
        .map((candidate) => ({
          candidate,
          score: getScore(isolatedNode, candidate),
          metadata:
            (candidate.languages || []).length +
            (candidate.topics || []).length +
            (candidate.tech || []).length,
        }))
        .sort((a, b) => b.score - a.score || b.metadata - a.metadata);

      let added = 0;
      for (const { candidate, score } of candidates) {
        if (added >= 2) break;

        const a = isolatedNode.graphId;
        const b = candidate.graphId;
        const pair = a < b ? `${a}|${b}` : `${b}|${a}`;
        if (existingPairs.has(pair)) continue;

        links.push({
          source: a,
          target: b,
          value: score > 0 ? score : 0.25,
          fallback: true,
          isolatedFallback: true,
        });

        existingPairs.add(pair);
        added += 1;
      }
    });

    const connectedNodeIds = new Set();
    links.forEach(link => {
      connectedNodeIds.add(String(link.source));
      connectedNodeIds.add(String(link.target));
    });

    console.log('TOTAL NODES:', nodes.length);
    console.log('TOTAL LINKS:', links.length);
    console.log('CONNECTED COMPONENTS:', components.length);
    console.log(
      'ISOLATED NODES:',
      nodes.filter(n => !connectedNodeIds.has(String(n.graphId))).map(n => n.name)
    );

    console.assert(components.length === 1, 'Graph is not fully connected!');
    console.assert(nodes.length === repos.length, 'Node count mismatch!');

    return { nodes, links };
  })();

  useEffect(() => {
    if (!fgRef.current || graphData.nodes.length === 0) return;

    // Keep the deterministic layout stable. There is deliberately no
    // charge/link force moving nodes outside the visible canvas.
    const charge = fgRef.current.d3Force('charge');
    if (charge) charge.strength(0);

    const link = fgRef.current.d3Force('link');
    if (link) link.strength(0);

    const center = fgRef.current.d3Force('center');
    if (center) center.strength(0);
  }, [graphData, dimensions.width, dimensions.height]);

  const handleNodeClick = useCallback((node) => {
    if (node?.url) {
      window.open(node.url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeId="graphId"
        nodeLabel={(node) => `
          <div style="
            background: rgba(10, 10, 10, 0.96);
            border: 1px solid rgba(255,255,255,0.12);
            padding: 12px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 280px;
          ">
            <div style="
              color: #22d3ee;
              font-weight: 500;
              font-size: 14px;
              margin-bottom: 6px;
            ">${node.name || 'Unnamed repository'}</div>

            <div style="
              color: rgba(255,255,255,0.72);
              font-size: 12px;
              line-height: 1.45;
              margin-bottom: 8px;
            ">${node.description || 'No description provided.'}</div>

            ${
              node.languages?.length
                ? `<div style="
                    color: rgba(255,255,255,0.45);
                    font-size: 10px;
                    margin-top: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                  ">
                    <span style="color:rgba(255,255,255,0.65)">Language:</span>
                    ${node.languages.join(' / ')}
                  </div>`
                : ''
            }

            ${
              node.tech?.length
                ? `<div style="
                    color: rgba(255,255,255,0.45);
                    font-size: 10px;
                    margin-top: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                  ">
                    <span style="color:rgba(255,255,255,0.65)">Tech:</span>
                    ${node.tech.join(' · ')}
                  </div>`
                : ''
            }

            ${
              node.topics?.length
                ? `<div style="
                    color: rgba(255,255,255,0.45);
                    font-size: 10px;
                    margin-top: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                  ">
                    <span style="color:rgba(255,255,255,0.65)">Topics:</span>
                    ${node.topics.join(', ')}
                  </div>`
                : ''
            }
          </div>
        `}
        nodeCanvasObject={(node, ctx) => {
          // Every node gets its own deterministic graphId and index.
          // This makes it impossible for two repositories to collapse
          // because of a duplicate GitHub id.
          const radius = 7;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Keep the repository number readable without relying on
          // globalScale, since zoom interaction is disabled.
          ctx.fillStyle = '#111111';
          ctx.font = '8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(node.repoIndex + 1), node.x, node.y);
        }}
        linkColor={(link) =>
          link.isolatedFallback
            ? 'rgba(255,255,255,0.24)'
            : link.fallback
              ? 'rgba(255,255,255,0.16)'
              : 'rgba(255,255,255,0.14)'
        }
        linkWidth={(link) =>
          link.isolatedFallback
            ? 1.1
            : link.fallback
              ? 0.8
              : Math.min(Math.max(link.value * 0.35, 0.5), 2.5)
        }
        onNodeClick={handleNodeClick}
        enableZoomInteraction={false}
        enablePanInteraction={true}
        cooldownTicks={0}
        warmupTicks={0}
        autoPauseRedraw={false}
      />
    </div>
  );
}
