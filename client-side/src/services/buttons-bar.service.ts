import jwt from 'jwt-decode';
import { Injectable } from "@angular/core";
import { PepColorService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from '@pepperi-addons/papi-sdk';
import {  PepSessionService } from '@pepperi-addons/ngx-lib';
import { IPepOption } from "@pepperi-addons/ngx-lib";
import { Page, PageConfiguration, PageConfigurationParameter, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { BehaviorSubject, distinctUntilChanged, Observable } from "rxjs";
import { config } from '../app/app.config';

@Injectable({
    providedIn: 'root',
})
export class ButtonsBarService {
    
    papiClient: PapiClient
    accessToken = '';
    parsedToken: any
    papiBaseURL = ''

    constructor(private pepColorService: PepColorService,
                public session: PepSessionService
                /*private httpService: PepHttpService*/) {
                    const accessToken = this.session.getIdpToken();
                    this.parsedToken = jwt(accessToken);
                    this.papiBaseURL = this.parsedToken["pepperi.baseurl"];

                    this.papiClient = new PapiClient({
                        baseURL: this.papiBaseURL,
                        token: this.session.getIdpToken(),
                        addonUUID: config.AddonUUID,
                        suppressLogging:true
                        //addonSecretKey: client.AddonSecretKey,
                        //actionUUID: client.AddonUUID
                    });
                }

     changeCursorOnDragStart() {
        document.body.classList.add('inheritCursors');
        document.body.style.cursor = 'grabbing';
    }

    changeCursorOnDragEnd() {
        document.body.classList.remove('inheritCursors');
        document.body.style.cursor = 'unset';
    }

        // This subject is for load page parameter options on the filter editor (Usage only in edit mode).
        private _pageParameterOptionsSubject: BehaviorSubject<Array<IPepOption>> = new BehaviorSubject<Array<IPepOption>>([]);
        get pageParameterOptionsSubject$(): Observable<Array<IPepOption>> {
            return this._pageParameterOptionsSubject.asObservable().pipe(distinctUntilChanged());
        }
    
        // This subjects is for dynamic parameters in Options source flow (Usage only in edit mode).
        private _flowDynamicParameters = new Map<string, SchemeFieldType>();
        get flowDynamicParameters(): ReadonlyMap<string, SchemeFieldType> {
            return this._flowDynamicParameters;
        }
    
        private setPageParameterOptions(page: Page): void {
            const pageParameterOptions: IPepOption[] = [];
            
            for (let index = 0; index < page?.Parameters?.length; index++) {
                const param = page.Parameters[index];
                pageParameterOptions.push({ key: param.Key, value: param.Key});
            }
            
            this._pageParameterOptionsSubject.next(pageParameterOptions);
        }
    
        private setFlowDynamicParameters(page: Page, currentPageConfiguration: PageConfiguration): void {
            const flowDynamicParameters = new Map<string, SchemeFieldType>();
    
            // Go over all the blocks in the page.
            for (let index = 0; index < page?.Blocks?.length; index++) {
                const block = page.Blocks[index];
    
                // Go over all the parameters in the block, If this param is produce then add it.
                for (let paramIndex = 0; paramIndex < block.PageConfiguration?.Parameters?.length; paramIndex++) {
                    const param = block.PageConfiguration.Parameters[paramIndex];
                    if (param.Produce) {
                        flowDynamicParameters.set(param.Key, param.Type as SchemeFieldType);
                    }
                }
            }
    
            // Go over all the parameters in the page.
            for (let index = 0; index < page?.Parameters?.length; index++) {
                const param = page.Parameters[index];
                flowDynamicParameters.set(param.Key, param.Type);
            }
    
            this._flowDynamicParameters = flowDynamicParameters;
        }
    
        /***********************************************************************************************/
        /*                                  Public functions
        /***********************************************************************************************/
    
        recalculateEditorData(page: Page, currentPageConfiguration: PageConfiguration): void {
            this.setPageParameterOptions(page);
            this.setFlowDynamicParameters(page, currentPageConfiguration);
        }

}
