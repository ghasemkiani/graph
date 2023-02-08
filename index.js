import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Node extends Obj {
	static {
		cutil.extend(this.prototype, {
			name: null,
			_edges: null,
		});
	}
	get edges() {
		if (!this._edges) {
			this._edges = [];
		}
		return this._edges;
	}
	set edges(edges) {
		this._edges = edges;
	}
}

class Edge extends Obj {
	static {
		cutil.extend(this.prototype, {
			source: null,
			target: null,
			type: null,
		});
	}
}

class Graph extends Obj {
	static {
		cutil.extend(this.prototype, {
			_nodes: null,
			directed: true,
		});
	}
	get nodes() {
		if (!this._nodes) {
			this._nodes = [];
		}
		return this._nodes;
	}
	set nodes(nodes) {
		this._nodes = nodes;
	}
	node(name) {
		let node = this.nodes.find(node => name === node.name);
		if (!node) {
			node = new Node({name});
			this.nodes.push(node);
		}
		return node;
	}
	edge(source, target, type) {
		this.node(source).edges.push(new Edge({source, target, type}));
		if (!this.directed && source !== target) {
			this.node(target).edges.push(new Edge({source: target, target: source, type}));
		}
		return this;
	}
	paths(name1, name2, maxlength = 0) {
		let paths = [];
		let items = [[name1]];
		let i = 0;
		while (!maxlength || ++i < maxlength) {
			let n = 0;
			let itms = [];
			for (let item of items) {
				for (let edge of this.node(item[item.length - 1]).edges) {
					if (!item.find((name, index) => name === edge.target && index % 2 === 0)) {
						itms.push([...item, edge.type, edge.target]);
						n++;
					}
				}
			}
			items = [];
			for (let item of itms) {
				if (item[item.length - 1] === name2) {
					paths.push(item);
				} else {
					items.push(item);
				}
			}
			if (n === 0) {
				break;
			}
		}
		return paths;
	}
}

export {Node, Edge, Graph};
