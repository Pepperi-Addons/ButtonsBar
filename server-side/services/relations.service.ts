import { PapiClient, Relation } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

export class RelationsService {

    papiClient: PapiClient
    bundleFileName = '';
    buttonSchema = {
        "Fields": {
            "ButtonsBarConfig": {
                "Type": "Object",
                "Fields": { // Gallery.MaxColumns
                    "Structure": {
                        "Type": "Object",
                        "Fields": {
                            "MaxColumns": {
                                "Type": "Integer",
                                "ConfigurationPerScreenSize": true
                            },
                            "Gap": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "Width": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "WidthType": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            },
                            "Alignment": {
                                "Type": "Object",
                                "Fields": {
                                    "Horizontal": {
                                        "Type": "String",
                                         "ConfigurationPerScreenSize": true
                                    },
                                    "Vertical": {
                                        "Type": "String",
                                         "ConfigurationPerScreenSize": true
                                    }
                                }
                            },
                            "Size": {
                                "Type": "String",
                                "ConfigurationPerScreenSize": true
                            }
                        }
                    }
                }
            }
        }
    }

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });

        this.bundleFileName = `file_${this.client.AddonUUID}`;
    }

    // For page block template
    private async upsertRelation(relation): Promise<Relation> {
        return await this.papiClient.addons.data.relations.upsert(relation);
    }

    async upsertRelations(){
        await this.upsertBlockRelation();
    }

      private async upsertBlockRelation(): Promise<any> {
            const blockRelationName = 'Buttons';
            const blockName = 'Block';
            const blockRelation: Relation = {
                RelationName: 'PageBlock',
                Name: blockRelationName,
                Description: `Buttons bar block`,
                Type: "NgComponent",
                SubType: "NG14",
                AddonUUID: this.client.AddonUUID,
                AddonRelativeURL: this.bundleFileName,
                ComponentName: `${blockName}Component`, // This is should be the block component name (from the client-side)
                ModuleName: `${blockName}Module`, // This is should be the block module name (from the client-side)
                ElementsModule: 'WebComponents',
                ElementName: `${blockName.toLocaleLowerCase()}-element-${this.client.AddonUUID}`,
                EditorComponentName: `${blockName}EditorComponent`, // This is should be the block editor component name (from the client-side)
                EditorModuleName: `${blockName}EditorModule`, // This is should be the block editor module name (from the client-side)}
                EditorElementName: `${blockName.toLocaleLowerCase()}-editor-element-${this.client.AddonUUID}`,
                Schema: this.buttonSchema,
                BlockLoadEndpoint: "/addon-cpi/run_on_load_event",
                BlockButtonClickEndpoint: "/addon-cpi/run_button_click_event",
                BlockStateChangeEndpoint: '/addon-cpi/on_block_state_change'
        }
        return await this.upsertRelation(blockRelation);
    }
}
