const fs = require('node:fs');

module.exports = {
    loadFile(dataPath) {
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));
        return JSON.parse(fs.readFileSync(dataPath, "utf8"));
    },

    saveFile(dataPath, toSave) {
        fs.writeFileSync(dataPath, JSON.stringify(toSave, null, 2));
    }
}