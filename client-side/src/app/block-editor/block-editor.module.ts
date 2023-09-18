import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { ButtonsEditorComponent } from './index';
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
import { FlowService } from '../../services/flow.service';
import { config } from '../app.config';

@NgModule({
    declarations: [ButtonsEditorComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        ButtonEditorModule,
        DragDropModule,
        PepFlowPickerButtonModule,
        PepSliderModule,
        PepGroupButtonsModule,
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
    exports: [ButtonsEditorComponent],
    providers: [
        TranslateStore,
        FlowService
        // Add here all used services.
    ]
})
export class ButtonsEditorModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
