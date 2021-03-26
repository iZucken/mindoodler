import {observable} from "mobx";

const {makeAutoObservable} = require("mobx");

export default class EditorStore {
    id = 0
    blocks = []
    constructor() {
        makeAutoObservable(this)
    }
    addBlock (block) {
        if (!block.id) {
            block.id = this.id
            this.id++
        }
        if (!block.links) {
            block.links = []
        }
        // this.blocks[block.id] = block
        this.blocks.push(block)
    }
    addLink (from, to) {
        this.blocks[from].links.push(to)
    }
    moveBlock(block, toX, toY) {
        this.blocks[block].position = {
            x: toX,
            y: toY,
        };
    }
}