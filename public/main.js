class Node {
    constructor(data) {
        this.data = data
        this.parent = null
        this.children = []
        this.files = []
    }
}

class Tree {

    constructor(data) {
        this._root = new Node(data, {
            path: '/'
        })
    }

    traverseBF(callback) {
        (function recurse(currentNode, deep) {
            for (let i = 0, length = currentNode.children.length; i < length; i++) {
                recurse(currentNode.children[i], deep + 1)
            }

            callback(currentNode, deep)

        })(this._root, 0)
    }

    contains(callback) {
        this.traverseBF(callback)
    };

    isExistDir(data, index) {
        let isExist = false

        const callback = (node, deep) => {
            if (node.data === data && deep === index) {
                isExist = true
            }
        }

        this.contains(callback)

        return isExist
    }

    add(data, toData, index) {
        if (this.isExistDir(data, index)) return null

        const child = new Node(data)
        let parent = null

        const callback = node => {
            if (node.data === toData) {
                parent = node
            }
        }

        this.contains(callback)

        if (parent) {
            parent.children.push(child)
            child.parent = parent
        } else {
            throw new Error('Cannot add node to a non-existent parent.')
        }
    }

    addFile(path, file) {
        (function recurse(currentNode, deep) {
            const index = currentNode.children.findIndex(item => item.data === path[deep])

            if (path.length - 1 > deep) {
                recurse(currentNode.children[index], deep + 1)
            } else {
                currentNode.children[index].files.push(file)
            }
        })(this._root, 0)
    }

    addFolder(path) {
        (function recurse(currentNode, deep) {
            const index = currentNode.children.findIndex(item => item.data === path[deep])

            if (path.length - 1 > deep) {
                recurse(currentNode.children[index], deep + 1)
            } else {
                currentNode.children[index].files.push(file)
            }
        })(this._root, 0)
    }

    toHtml() {
        const frameElement = document.createDocumentFragment();

        (function recurse(currentNode, prevElement) {
            const item = document.createElement('li')

            const name = document.createElement('span')
            name.setAttribute('class', 'caret')
            name.innerText = currentNode.data
            item.appendChild(name)


            const nestedList = document.createElement('ul')
            nestedList.setAttribute('class', 'nested')

            for (let i = 0, length = currentNode.children.length; i < length; i++) {
                recurse(currentNode.children[i], nestedList)
            }

            item.appendChild(nestedList)
            prevElement.appendChild(item)
        })(this._root, frameElement)

        return frameElement
    }
}

class Files {
    constructor(Tree) {
        this.files = []

        this.Tree = Tree
    }

    async fetch() {
        const response = await fetch('/api/files')
        this.files = await response.json()

        return this.files
    }

    addFilesToTree() {
        this.files.forEach(file => {
            const dirs = file.path.split('/')

            this.Tree.addFolder(dirs[0], 'root', 1)

            dirs.slice(1).forEach((dir, index) => {
                this.Tree.addFolder(dir, dirs[index], index + 2)
            })

            //this.Tree.addFile(dirs, file)
            //this.Tree.add(dirs[dirs.length], 'root', 1)
        })
    }
}

function toggleTree() {
    const tree = document.querySelector('#tree')

    tree.addEventListener('click', e => {
        if (e.target.classList.contains('caret')) {
            e.target.parentElement.querySelector('.nested').classList.toggle('active')
        }
    })
}

async function init() {
    const filesInstance = new Files(new Tree('root'))

    await filesInstance.fetch()

    filesInstance.addFilesToTree()

    const treeElement = document.querySelector('#tree')

    treeElement.appendChild(filesInstance.Tree.toHtml())

    toggleTree()
}

init()


