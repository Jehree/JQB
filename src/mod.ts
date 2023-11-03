import * as fs from "fs";
import JSON5 from 'json5'
import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { InstanceManager } from "./InstanceManager";
import { IQuest } from "@spt-aki/models/eft/common/tables/IQuest";
import { QuestTypeEnum } from "@spt-aki/models/enums/QuestTypeEnum";
import { JQBQuestDatabaseItem } from "./CustomTypes";
import { JehreeUtilities } from "./JehreeUtilities";
import type { JQBQuestFile, Tagvar } from "./CustomTypes";
import type { JQBQuest } from "./CustomTypes";
import type { TraderName } from "./InstanceManager";
import { TraderIdsByName } from "./InstanceManager";
import { TagManager } from "./TagManager";
import { TagvarManager } from "./TagvarManager";

class Mod implements IPreAkiLoadMod, IPostDBLoadMod
{
    private _inst:InstanceManager = new InstanceManager()
    private _tagManager:TagManager = new TagManager()
    private _tagvarManager:TagvarManager = new TagvarManager()

    private modName:string = "Jehree's Quest Loader"

    preAkiLoad(container: DependencyContainer): void
    {
        this._inst.initPreAkiLoad(container, this.modName)
        this._tagManager.initLogger(this._inst.logger)
        this._tagvarManager.initLogger(this._inst.logger)
    }

    postDBLoad(container: DependencyContainer): void
    {
        this._inst.initPostDBLoad(container)
        const lg = this._inst.logger

        const stringArray = [
            "multiple strings in the array will ",
            "be concatinated.",
            "certain tag vars can be used as one of the array values like: ",
            "tagvar_category_weapons",
            " to act like variables. This can be used to ",
            "give each quest similar locales with variance via variables."
        ]


      
        const questPaths:string[] = this.getAllQuestPaths()
        for (const path of questPaths)
        {
            const questFile:JQBQuestFile = this.readQuestFile(path)
            const quests = questFile.quests

            const testLocale = this._tagManager.buildLocaleString(stringArray, questFile, "example_quest_2")
            //console.log(testLocale)

            for (const quest in quests)
            {
                const thisQuest:JQBQuest = quests[quest]
                for (const tagKey in thisQuest)
                {
                    this._tagManager.handleTag(questFile, quest, tagKey, this._inst)
                }
                const dbQuest = this.createQuest(thisQuest, quest)
                this._inst.dbQuests[quest] = dbQuest as unknown as IQuest
            }
        }
    }

    readQuestFile(path:string): JQBQuestFile
    {
        return JehreeUtilities.readJsonFile(path, true)
    }


    handleJQBQuests(): void
    {
        const questPaths = this.getAllQuestPaths()

        for (const path of questPaths)
        {
            const questFile: JQBQuestFile = this.readQuestFile(path)
            const quests:{questKey: JQBQuest} = questFile.quests

            for (const questKey in quests)
            {
                //
            }

        }
    }

    getAllQuestPaths():string[]
    {
        const questFolder = this._inst.modPath + "\\quests"
        const questPaths = this.getJQBQuestPathsFromFolder(questFolder)

        const modPaths = JehreeUtilities.getFilePaths(this._inst.modsFolderPath, [""])

        for (const modFolderPath of modPaths)
        {
            const thisModQuestsFolder = modFolderPath + "\\JQB_quests"
            
            if (!fs.existsSync(thisModQuestsFolder)) continue
            
            const thisModQuestPaths = this.getJQBQuestPathsFromFolder(thisModQuestsFolder)

            questPaths.push(...thisModQuestPaths)
        }

        return questPaths
    }

    getJQBQuestPathsFromFolder(folderPath:string):string[]
    {

        const paths:string[] = []

        //push loose quest files to paths
        paths.push(...JehreeUtilities.getFilePaths(folderPath, [".json5"]))

        //push quest files in subfolders to paths
        paths.push(...JehreeUtilities.getFilePathsFromSubFolders(folderPath, [".json5"]))
        
        return paths
    }

    createQuest(quest:JQBQuest, questKey:string): JQBQuestDatabaseItem
    {
        const traderName = quest.trader

        const traderId = this._inst.traderIdsByName[traderName] ?? traderName
        const questId = questKey
        
        return {
            QuestName: questId,
            _id: questId,
            acceptPlayerMessage: questId + " acceptPlayerMessage",
            canShowNotificationsInGame: true,
            changeQuestMessageText: questId + " changeQuestMessageText",
            completePlayerMessage: questId + " completePlayerMessage",
            conditions: {
                AvailableForFinish: [],
                AvailableForStart: []
            },
            description: questId + " description",
            failMessageText: questId + " failMessageText",
            image: "/files/quest/icon/596b465486f77457ca186188.jpg",
            instantComplete: false,
            isKey: false,
            location: "any",
            name: questId + " name",
            note: questId + " note",
            restartable: false,
            rewards: {
                Fail: [],
                Started: [],
                Success: []
            },
            secretQuest: false,
            side: "Pmc",
            startedMessageText: questId + " startedMessageText",
            successMessageText: questId + " successMessageText",
            templateId: questId,
            traderId: traderId,
            type: QuestTypeEnum.ELIMINATION
        }
    }
}

module.exports = { mod: new Mod() }