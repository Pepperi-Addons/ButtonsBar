import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonEditorComponent } from './button-editor.component'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepMenuModule } from '@pepperi-addons/ngx-lib/menu';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { TranslateModule, TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepSliderModule} from '@pepperi-addons/ngx-lib/slider';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { PepIconPickerModule } from '@pepperi-addons/ngx-composite-lib/icon-picker';
import { PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { MatDialogModule } from '@angular/material/dialog';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepImageModule } from '@pepperi-addons/ngx-lib/image';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { config } from '../../app.config';
import { PepIconRegistry, pepIconSystemBin, pepIconSystemMove, pepIconArrowBack, pepIconArrowBackRight, pepIconArrowDown, pepIconArrowDownAlt, pepIconArrowBackLeft, pepIconArrowEither, pepIconArrowLeft, pepIconArrowLeftAlt, pepIconArrowRight,pepIconArrowRightAlt} from '@pepperi-addons/ngx-lib/icon';import { PepFlowPickerButtonModule } from '@pepperi-addons/ngx-composite-lib/flow-picker-button';
import { PepFieldTitleModule } from '@pepperi-addons/ngx-lib/field-title';
import { PepDraggableItemsModule } from '@pepperi-addons/ngx-lib/draggable-items';

const pepIcons = [
    pepIconSystemBin,
    pepIconSystemMove,
    pepIconArrowBack,
    pepIconArrowBackRight,
    pepIconArrowDown, 
    pepIconArrowDownAlt,
    pepIconArrowBackLeft, pepIconArrowEither, pepIconArrowLeft, pepIconArrowLeftAlt, pepIconArrowRight,pepIconArrowRightAlt
]
@NgModule({
    declarations: [ButtonEditorComponent],
    imports: [
        CommonModule,
        DragDropModule,
        PepButtonModule,
        PepMenuModule,
        PepTextboxModule,
        PepCheckboxModule,
        PepSliderModule,
        PepNgxLibModule,
        PepSelectModule,
        MatDialogModule,
        PepGroupButtonsModule,
        PepColorModule,
        PepGroupButtonsSettingsModule,
        PepImageModule,
        PepTextareaModule,
        PepFlowPickerButtonModule,
        PepIconPickerModule,
        PepFieldTitleModule,
        PepDraggableItemsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [ButtonEditorComponent]
})
export class ButtonEditorModule {
    constructor(
        private pepIconRegistry: PepIconRegistry,
    ) {
        this.pepIconRegistry.registerIcons(pepIcons);
    }
}
