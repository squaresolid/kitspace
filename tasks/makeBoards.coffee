yaml    = require('js-yaml')
fs      = require('fs')
path    = require('path')
globule = require('globule')

boardDir      = 'boards'
boardJsonPath = 'build/boards.json'

if require.main != module
    exports.deps = globule.find("#{boardDir}/**/1click-info.yaml")
    exports.targets = [boardJsonPath]
else
    boards = []
    correctTypes = (boardInfo) ->
        boardInfoWithEmpty =
            { name        : ''
            , folder      : ''
            , description : ''
            , author      : ''
            , version     : ''
            , site        : ''
            , license     : ''
            }
        for prop of boardInfoWithEmpty
            if (boardInfo.hasOwnProperty(prop))
                boardInfoWithEmpty[prop] = String(boardInfo[prop])
        return boardInfoWithEmpty

    paths = process.argv.slice(2)
    for p in paths
        if p == '--' then break
        doc = correctTypes(yaml.safeLoad(fs.readFileSync(p)))
        if doc.name == ''
            console.log("'#{p}' needs a name property")
            process.exit(1)
        else if doc.version == ''
            console.log("'#{p}' needs a version property")
            process.exit(2)
        doc.folder = path.dirname(path.relative(boardDir, p))
        boards.push(doc)

    boardJson = fs.openSync(boardJsonPath, 'w')
    fs.write(boardJson, JSON.stringify(boards))