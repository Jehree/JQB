/* eslint-disable @typescript-eslint/naming-convention */
import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { JQBQuest, JQBQuestFile, LocaleTagType, TagType, Tagvar } from "./CustomTypes"
import { TagvarManager } from "./TagvarManager"
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor"
import { JehreeUtilities } from "./JehreeUtilities"
import { InstanceManager } from "./InstanceManager"
import { ILocaleBase } from "@spt-aki/models/spt/server/ILocaleBase"



export class TagManager
{
    private _tagvarManager:TagvarManager = new TagvarManager()
    private logger:ILogger

    public localeTags = {
        loc_quest_name: " name",
        loc_description: " description",
        loc_acc_msg: " acceptPlayerMessage",
        loc_chng_msg: " changeQuestMessageText",
        loc_cmplt_msg: " completePlayerMessage",
        loc_fail_msg: " failMessageText",
        loc_start_msg: " startedMessageText",
        loc_succ_msg: " successMessageText"
    }

    private tagTypes:TagType[] = [
        "name" ,
        "side" ,
        "trader" ,
        "loc_" ,
        "image_filename" ,
        "bool_" ,
        "start_conditions" ,
        "fin_conditions" ,
        "start_rewards" ,
        "fail_rewards" ,
        "succ_rewards"
    ]

    handleTag(questFile:JQBQuestFile, questKey:string, tagKey:string, _inst:InstanceManager):any
    {
        const tagType = this.getTagType(tagKey)

        switch (tagType)
        {
            case "loc_":{
                this.handleLocaleTag(questFile, questKey, tagKey, _inst.dbLocales)
                return
            }
        }

        this.logger.log("Tag handler unable to find use for tag: " + tagKey, LogTextColor.YELLOW)
    }

    // LOCALE STUFF -----v
    handleLocaleTag(questFile:JQBQuestFile, questKey:string, tagKey:string, dbLocales:ILocaleBase):void
    {
        const quest:JQBQuest = questFile.quests[questKey]
        const stringArray:string[] = quest[tagKey]

        const dbLocaleKey = this.buildLocaleKey(questKey, tagKey)
        console.log(dbLocaleKey)
        const localeString = this.buildLocaleString(stringArray, questFile, questKey)
        JehreeUtilities.localeSetter(dbLocaleKey, localeString, dbLocales)
    }

    buildLocaleString(stringArray:string[], questFile:JQBQuestFile, questKey:string):string
    {
        let localeString = ""
        const tagvars:{tagvarKey: Tagvar} = questFile.custom_tagvars
        const tagvarNames:string[] = Object.keys(tagvars)

        for (const string of stringArray)
        {
            if (!tagvarNames.includes(string))
            {
                localeString += string
                continue
            }

            const thisTagvar = tagvars[string]
            const tagvarString = this._tagvarManager.resolveTagvar(thisTagvar, questFile, questKey)
            localeString += tagvarString
        }

        return localeString
    }

    buildLocaleKey(questId:string, localeTagType:string):string
    {
        return questId + this.localeTags[localeTagType]
    }
    // LOCALE STUFF -----^



    getTagType(tagKey:string):TagType
    {
        for (const type of this.tagTypes)
        {
            if (tagKey.startsWith(type))
            {
                return type
            }
        }

        this.logger.log("Tag type not found for this tag key: " + tagKey, LogTextColor.YELLOW)
        return
    }

    initLogger(logger:ILogger):void
    {
        this.logger = logger
    }
}
