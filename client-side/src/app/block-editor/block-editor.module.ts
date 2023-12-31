import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { BlockEditorComponent } from './index';
import { ButtonEditorModule } from '../component/button-editor/button-editor.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepSliderModule } from '@pepperi-addons/ngx-lib/slider';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepFieldTitleModule } from '@pepperi-addons/ngx-lib/field-title';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepFlowPickerButtonModule } from '@pepperi-addons/ngx-composite-lib/flow-picker-button';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { PepIconRegistry, pepIconNumberPlus } from '@pepperi-addons/ngx-lib/icon';
import { FlowService } from '../../services/flow.service';
import { config } from '../app.config';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';

const pepIcons = [
    pepIconNumberPlus
]

@NgModule({
    declarations: [BlockEditorComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        ButtonEditorModule,
        DragDropModule,
        PepFlowPickerButtonModule,
        PepSliderModule,
        PepGroupButtonsModule,
        PepNgxCompositeLibModule,
        PepFieldTitleModule,
        PepGroupButtonsSettingsModule,
        PepTextboxModule,
        PepButtonModule,

        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [BlockEditorComponent],
    providers: [
        TranslateStore,
        FlowService
        // Add here all used services.
    ]
})
export class BlockEditorModule {
    constructor(
        translate: TranslateService,
        private pepIconRegistry: PepIconRegistry,
        private pepAddonService: PepAddonService
    ) {
        this.pepIconRegistry.registerIcons(pepIcons);
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
