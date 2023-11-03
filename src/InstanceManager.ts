/* eslint-disable @typescript-eslint/naming-convention */
//import * as fs from "fs";
import * as path from "path";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { DependencyContainer } from "tsyringe";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { RagfairPriceService } from "@spt-aki/services/RagfairPriceService";
import { ImporterUtil } from "@spt-aki/utils/ImporterUtil";
import { SaveServer } from "@spt-aki/servers/SaveServer";
import { ItemHelper } from "@spt-aki/helpers/ItemHelper";
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { IQuest } from "@spt-aki/models/eft/common/tables/IQuest";
import { ILocaleBase } from "@spt-aki/models/spt/server/ILocaleBase";



export class InstanceManager
{
    //useful paths
    public modName: string;
    public modPath: string = path.normalize(path.join(__dirname, ".."));
    public profilePath: string = path.normalize(path.join(__dirname, "..", "..", "..", "profiles"));
    public modsFolderPath: string = path.normalize(path.join(__dirname, "..", ".."));

    public traderIdsByName:TraderIdsByName = {
        mechanic: "5a7c2eca46aef81a7ca2145d",
        skier: "58330581ace78e27b8b10cee",
        peacekeeper: "5935c25fb3acc3127c3d8cd9",
        therapist: "54cb57776803fa99248b456e",
        prapor: "54cb50c76803fa8b248b4571",
        jaeger: "5c0647fdd443bc2504c2d371",
        ragman: "5ac3b934156ae10c4430e83c",
        fence: "579dc571d53a0658a154fbec"       
    }
    public currencyIdsByName:CurrencyIdsByName = {
        RUB: "5449016a4bdc2d6f028b456f",
        EUR: "569668774bdc2da2298b4568",
        USD: "5696686a4bdc2da3298b456a"
    }

    //initialized at preAkiLoadMod
    public container: DependencyContainer;
    public preAkiModLoader: PreAkiModLoader;
    public imageRouter: ImageRouter;
    public configServer: ConfigServer;
    public saveServer: SaveServer;
    public itemHelper: ItemHelper;
    public logger: ILogger;
    public staticRouter: StaticRouterModService;

    //initialized at postDBLoadMod
    public dbTables: IDatabaseTables;
    public dbItems: Record<string, ITemplateItem>
    public dbQuests: Record<string, IQuest>
    public dbLocales: ILocaleBase
    public customItem: CustomItemService;
    public jsonUtil: JsonUtil;
    public profileHelper: ProfileHelper;
    public ragfairPriceService: RagfairPriceService;
    public importerUtil: ImporterUtil;

    public initPreAkiLoad(container: DependencyContainer, modName:string): void
    {
        this.modName = modName;
        this.container = container;
        this.preAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        this.imageRouter = container.resolve<ImageRouter>("ImageRouter");
        this.configServer = container.resolve<ConfigServer>("ConfigServer");
        this.saveServer = container.resolve<SaveServer>("SaveServer");
        this.itemHelper = container.resolve<ItemHelper>("ItemHelper");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.staticRouter = container.resolve<StaticRouterModService>("StaticRouterModService");
    }

    public initPostDBLoad(container: DependencyContainer): void
    {
        this.dbTables = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        this.dbItems = this.dbTables.templates.items
        this.dbQuests = this.dbTables.templates.quests
        this.dbLocales = this.dbTables.locales
        this.customItem = container.resolve<CustomItemService>("CustomItemService");
        this.jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.ragfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService");
        this.importerUtil = container.resolve<ImporterUtil>("ImporterUtil");
    }
}

export type TraderName =
"mechanic" |
"skier" |
"peacekeeper" |
"therapist" |
"prapor" |
"jaeger" |
"ragman" |
"fence" 


export type TraderIdsByName = {
    mechanic: "5a7c2eca46aef81a7ca2145d",
    skier: "58330581ace78e27b8b10cee",
    peacekeeper: "5935c25fb3acc3127c3d8cd9",
    therapist: "54cb57776803fa99248b456e",
    prapor: "54cb50c76803fa8b248b4571",
    jaeger: "5c0647fdd443bc2504c2d371",
    ragman: "5ac3b934156ae10c4430e83c",
    fence: "579dc571d53a0658a154fbec"       
}

export type CurrencyIdsByName = {
    RUB: "5449016a4bdc2d6f028b456f",
    EUR: "569668774bdc2da2298b4568",
    USD: "5696686a4bdc2da3298b456a"
}
