/* eslint-disable @typescript-eslint/naming-convention */

import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { IteratorTagvar, JQBQuestFile, Tagvar, TagvarType } from "./CustomTypes"
import { JehreeUtilities } from "./JehreeUtilities"
import { InstanceManager } from "./InstanceManager"


export class TagvarManager
{
    private logger:ILogger
    
    getCustomTagvarNames(questFile:JQBQuestFile):string[]
    {
        return Object.keys(questFile.custom_tagvars)
    }

    resolveTagvar(tagvar:Tagvar, questFile:JQBQuestFile, questKey:string):any
    {
        const type:TagvarType = tagvar.type

        switch (type)
        {
            case "iterator":{
                return this.resolveIteratorTagvar(tagvar, questFile, questKey)
            }
        }
    }

    resolveIteratorTagvar(tagvar:Tagvar, questFile:JQBQuestFile, questKey:string):string
    {
        const iteratorTagvar = tagvar as IteratorTagvar
        const questKeys = Object.keys(questFile.quests)
        //const iteratorTagvars = this.getArrayOfTagvarsByType(questFile, "iterator")
        const questIndex:number = JehreeUtilities.caclulateIndexOfArrayValue(questKeys, questKey)

        //check iterator tagvar for a matching iteration
        const indexOffset = iteratorTagvar.start_quest_index
        const iteratorValue = iteratorTagvar.iterations[questIndex - indexOffset]

        if (iteratorValue === undefined)
        {
            return "JQB Iterator Tagvar failed to supply valid iteration"
        }

        return iteratorValue
    }

    //this func is currently unused, keeping it for now
    getArrayOfTagvarsByType(questFile:JQBQuestFile, type:TagvarType):Tagvar[]
    {
        const tagvars = questFile.custom_tagvars
        let thisTypeTagvars:Tagvar[]

        for (const tagvarKey in tagvars)
        {
            const thisTagvar:Tagvar = tagvars[tagvarKey]

            if (thisTagvar.type === type)
            {
                thisTypeTagvars.push(thisTagvar)
            }
        }

        return thisTypeTagvars as Tagvar[]
    }

    initLogger(logger:ILogger):void
    {
        this.logger = logger
    }
}


