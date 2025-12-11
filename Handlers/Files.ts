import FS from "node:fs";

export default class FilesHandler {
    static loadFile(dataPath: any) {
        if (!FS.existsSync(dataPath)) FS.writeFileSync(dataPath, JSON.stringify({}));
        return JSON.parse(FS.readFileSync(dataPath, "utf8"));
    }

    static saveFile(dataPath: any, toSave: JSON) {
        FS.writeFileSync(dataPath, JSON.stringify(toSave, null, 2));
    }
}