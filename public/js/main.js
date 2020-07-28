function toggleTree() {
    const tree = document.querySelector('#tree')

    tree.addEventListener('click', e => {
        if (e.target.classList.contains('caret')) {
            e.target.parentElement.querySelector('.nested').classList.toggle('active')
        }
    })
}

async function init() {
    const filesInstance = new Files(new Tree(''))
    await filesInstance.fetch()
    filesInstance.addFilesToTree()

    const treeElement = document.querySelector('#tree')
    treeElement.appendChild(filesInstance.Tree.toHtml())
    toggleTree()

    window.z = filesInstance
}

init()


