import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { BlockComponent } from './index';
import { config } from '../app.config';
import { PepIconRegistry,pepIconSystemCopy,  pepIconArrowDown, pepIconBarndPepperi } from '@pepperi-addons/ngx-lib/icon';
import { MatBadgeModule } from '@angular/material/badge';

const pepIcons = [
    pepIconArrowDown,
    pepIconBarndPepperi,
    pepIconSystemCopy
]
export const routes: Routes = [
    {
        path: '',
        component: BlockComponent
    }
];

@NgModule({
    declarations: [BlockComponent],
    imports: [
        CommonModule,
        PepButtonModule,
        MatBadgeModule,
        
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [BlockComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class BlockModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService,
        private pepIconRegistry: PepIconRegistry)
        {
            this.pepIconRegistry.registerIcons(pepIcons);
            this.pepAddonService.setDefaultTranslateLang(translate);
        }
}
