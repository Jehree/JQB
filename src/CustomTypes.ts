/* eslint-disable @typescript-eslint/naming-convention */
import { QuestTypeEnum } from "@spt-aki/models/enums/QuestTypeEnum"
import { TraderName } from "./InstanceManager"


//I should ideally use IQuest, but it has some annoying quirks so using this instead
export interface JQBQuestDatabaseItem
{
    QuestName: string,
    _id: string,
    acceptPlayerMessage: string,
    canShowNotificationsInGame: true,
    changeQuestMessageText: string,
    completePlayerMessage: string,
    conditions: {
        AvailableForFinish: any[],
        AvailableForStart: any[]
    },
    description: string,
    failMessageText: string,
    image: string,
    instantComplete: boolean,
    isKey: boolean,
    /** location id or "any" */
    location: string,
    name: string,
    note: string,
    restartable: boolean,
    rewards: {
        Fail: any[],
        Started: any[],
        Success: any[]
    },
    secretQuest: boolean,
    /** "Pmc" or "Scav" */
    side: FactionSide,
    startedMessageText: string,
    successMessageText: string,
    templateId: string,
    traderId: string,
    type: QuestTypeEnum
}

export interface JQBQuestFile
{
    custom_tagvars?: {tagvarKey: Tagvar}
    global_tags?: any,
    quests:{questKey: JQBQuest}
}

export interface Tagvar
{
    type: TagvarType,
}

/*
export interface Tag
{
    name: string,
    side: FactionSide,
    trader: TraderName | string,

    loc_description?: string[],
    loc_acc_msg?: string[],
    loc_chng_msg?: string[],
    loc_cmplt_msg?: string[],
    loc_fail_msg?: string[],
    loc_start_msg?: string[],
    loc_succ_msg?: string[],

    image_filename?:string,

    bool_can_show_notif?: boolean,
    bool_inta_cmplt?: boolean,
    bool_restartable?: boolean,
    bool_secret_quest?: boolean,

    start_conditions?: any,
    fin_conditions?: any,

    start_rewards?: any,
    fail_rewards?: any,
    succ_rewards?: any
}
*/

export interface IteratorTagvar extends Tagvar
{
    /** What index of quest to begin iteration */
    start_quest_index: number,
    iterations:string[]
}

export interface JQBQuest
{
    /** is this parameter needed? */
    name?: string,
    side: FactionSide,
    trader: TraderName | string,

    loc_quest_name?: string[],
    loc_description?: string[],
    loc_acc_msg?: string[],
    loc_chng_msg?: string[],
    loc_cmplt_msg?: string[],
    loc_fail_msg?: string[],
    loc_start_msg?: string[],
    loc_succ_msg?: string[],

    image_filename?:string,

    bool_can_show_notif?: boolean,
    bool_inta_cmplt?: boolean,
    bool_restartable?: boolean,
    bool_secret_quest?: boolean,

    start_conditions?: any,
    fin_conditions?: any,

    start_rewards?: any,
    fail_rewards?: any,
    succ_rewards?: any
}

export type TagType =
"name" |
"side" |
"trader" |
"loc_" |
"image_filename" |
"bool_" |
"start_conditions" |
"fin_conditions" |
"start_rewards" |
"fail_rewards" |
"succ_rewards";

export type LocaleTagType= 
"loc_description" |
"loc_acc_msg" |
"loc_chng_msg" |
"loc_cmplt_msg" |
"loc_fail_msg" |
"loc_start_msg" |
"loc_succ_msg";

export type TagvarType =
"iterator";

export type FactionSide =
"Pmc" | "Scav";