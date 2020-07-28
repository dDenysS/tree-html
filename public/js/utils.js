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
        this._root = new Node(data)
    }

    getOrAddFolder(path) {
        let lastNode

        (function recurse(currentNode, deep) {
            const index = currentNode.children.findIndex(item => item.data === path[deep])

            if (path.length - 1 >= deep) {
                if (index === -1) {
                    const folder = new Node(path[deep])
                    folder.parent = currentNode

                    currentNode.children.push(folder)

                    recurse(currentNode.children[currentNode.children.length - 1], deep + 1)
                } else {
                    recurse(currentNode.children[index], deep + 1)
                }
            } else {
                lastNode = currentNode
            }


        })(this._root, 0)

        return lastNode
    }

    toHtml() {
        const frameElement = document.createDocumentFragment();

        (function recurse(currentNode, prevElement) {
            const item = document.createElement('li')
            item.setAttribute('class', 'item')

            item.appendChild(Files.createFolderElement(currentNode))
            currentNode.files.forEach(file => item.appendChild(Files.createFileElement(file)))

            if (currentNode.children.length) {
                const nestedList = document.createElement('ul')
                nestedList.setAttribute('class', 'nested')

                for (let i = 0, length = currentNode.children.length; i < length; i++) {
                    recurse(currentNode.children[i], nestedList)
                }

                item.appendChild(nestedList)
            }

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

    static createFolderElement(currentNode) {
        const isEmptyFolder = !currentNode.children.length

        const name = document.createElement('span')
        name.setAttribute('class', `caret ${isEmptyFolder ? 'empty-folder' : ''}`)
        name.innerText = `${currentNode.data === '' ? 'root(/)' : currentNode.data} ${isEmptyFolder ? '(empty folder)' : ''}`

        return name
    }

    static createFileElement(file) {
        const fileElement = document.createElement('span')
        fileElement.setAttribute('class', 'file')
        fileElement.innerText = file.name

        return fileElement
    }

    static normalizePath(_path) {
        let path = _path.split(' ').join('')

        if (path === '\\' || path === '/') return '/'

        const len = path.length
        if (len <= 1) return path

        let prefix = ''
        if (len > 4 && path[3] === '\\') {
            const ch = path[2]
            if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
                path = path.slice(2)
                prefix = '//'
            }
        }

        const segs = path.split(/[/\\]+/)
        if (segs[segs.length - 1] === '') {
            segs.pop()
        }
        return prefix + segs.join('/')
    }

    addFilesToTree() {
        this.files.forEach(file => {
            const path = Files.normalizePath(file.path)

            if (path === '/') {
                return this.Tree._root.files.push(file)
            }

            const dirs = path.split('/')

            const folder = this.Tree.getOrAddFolder(dirs)

            folder.files.push(file)
        })
    }
}
