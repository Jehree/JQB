import { ILocaleBase } from "@spt-aki/models/spt/server/ILocaleBase";
import * as fs from "fs";
import * as path from "path";
import JSON5 from 'json5'
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

export class JehreeUtilities 
{
    static getFilePathsFromSubFolders(folderPath:string, onlyTheseExtensions?:Array<string>):string[]
    {
        const paths:string[] = []
        const subFolders = this.getFilePaths(folderPath, [""])

        for (const subFolderPath of subFolders)
        {

            const subFolderJsons = this.getFilePaths(subFolderPath, onlyTheseExtensions)
            paths.push(...subFolderJsons)
        }

        return paths
    }

    static getFilePaths(folderPath:string, onlyTheseExtensions?:Array<string>):Array<string>
    {
        const directoryFileNames = this.getFileNames(folderPath, onlyTheseExtensions)
        const filePaths:string[] = []  

        for (const fileName of directoryFileNames)
        {
            const filePath = path.join(folderPath, fileName)
            filePaths.push(filePath)
        }

        return filePaths;
    }

    static getFileNames(folderPath:string, onlyTheseExtensions?:Array<string>):Array<string>
    {
        const directoryFileNames = fs.readdirSync(folderPath)

        if (onlyTheseExtensions.length > 0)
        {
            const jsonFileNames:string[] = []
            
            for (const fileName of directoryFileNames)
            {
                const fileExtension = path.extname(fileName)

                if (!onlyTheseExtensions.includes(fileExtension)) continue
                
                jsonFileNames.push(fileName)
            }

            return jsonFileNames as Array<string>
        }
        return directoryFileNames
    }

    static readJsonFile(path:string, json5?:boolean):any
    {
        try
        {
            const file = fs.readFileSync(path, "utf8")

            if (json5) return JSON5.parse(file)
    
            return JSON.parse(file)
        } 
        catch (err: unknown)
        {
            if (err instanceof Error)
            {
                console.log("!!!-----------------------------------------------------------!!!")
                console.log("!!!-----------------------------------------------------------!!!")
                console.log("!!!-----------------------------------------------------------!!!")
                console.log("[JEHREE UTILITIES WARNING]: Tried to read json at invalid path: " + path)
                console.log("!!!-----------------------------------------------------------!!!")
                console.log("!!!-----------------------------------------------------------!!!")
                console.log("!!!-----------------------------------------------------------!!!")
            }
        }
    }

    static localeSetter(key:string, value:string, dbLocales: ILocaleBase):void
    {
        const locales = Object.values(dbLocales.global)

        for (const lang of locales)
        {
            lang[key] = value
        }
    }

    static caclulateIndexOfArrayValue(array:any[], value:any):number
    {
        let calculatedIndex:number

        for (let i = 0; i < array.length; i++)
        {
            if (array[i] === value)
            {
                calculatedIndex = i
                break
            }
        }

        return calculatedIndex
    }
}