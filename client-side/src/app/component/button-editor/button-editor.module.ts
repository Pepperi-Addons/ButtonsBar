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
import { PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';
import { MatDialogModule } from '@angular/material/dialog';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';
import { PepGroupButtonsModule } from '@pepperi-addons/ngx-lib/group-buttons';
import { PepImageModule } from '@pepperi-addons/ngx-lib/image';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { config } from '../../app.config';
import { PepIconRegistry, pepIconSystemMove, pepIconArrowBack, pepIconArrowBackRight, pepIconArrowDown, pepIconArrowDownAlt, pepIconArrowBackLeft, pepIconArrowEither, pepIconArrowLeft, pepIconArrowLeftAlt, pepIconArrowRight,pepIconArrowRightAlt, pepIconArrowTwoWaysHorL, pepIconArrowTwoWaysHorR,pepIconArrowTwoWaysVerB, pepIconArrowTwoWaysVerT,pepIconArrowUp, pepIconArrowUpAlt, pepIconBarndPepperi,pepIconDeviceDesktop,pepIconDeviceMobile,pepIconDeviceResponsive,pepIconDeviceTablet,pepIconIndicatorDotPlaceholder,pepIconLeafRound,pepIconLeafSkiny,pepIconMiscExcel,pepIconNoImage,pepIconNoImage2,pepIconNumberCoins,pepIconNumberDecimal,pepIconNumberDollar,pepIconNumberEuro,pepIconNumberMinus,pepIconNumberNumber,pepIconNumberPercent,pepIconNumberPlus,pepIconRipplesTransparent,pepIconShoppingCart,pepIconShoppingPaper
         , pepIconSystemAlert,pepIconSystemAttach,pepIconSystemAvatar,pepIconSystemBell,pepIconSystemBellOn,pepIconSystemBin,pepIconSystemBolt,pepIconSystemBoolean,pepIconSystemChat,pepIconSystemCircle,pepIconSystemClose,pepIconSystemCopy,pepIconSystemDoc,pepIconSystemDoor,pepIconSystemDotEllipsis,pepIconSystemEdit,pepIconSystemEducation,pepIconSystemEmail,pepIconSystemFileDownload,pepIconSystemFileUpload,pepIconSystemFileUploadCloud,pepIconSystemFilter,pepIconSystemFilter2,pepIconSystemFlag,pepIconSystemFolder,pepIconSystemFullScreen,pepIconSystemHeart,pepIconSystemHelp,pepIconSystemHome,pepIconSystemImage,pepIconSystemInfo,pepIconSystemInventory,pepIconSystemLink,pepIconSystemLock,pepIconSystemLogic,pepIconSystemMap,pepIconSystemMegaphone,pepIconSystemMenu,pepIconSystemMenuDots,pepIconSystemMust,pepIconSystemOffLine,pepIconSystemOk,pepIconSystemPause,pepIconSystemPhone,pepIconSystemPlay,pepIconSystemPrint,pepIconSystemProcessing,pepIconSystemQuestion,pepIconSystemRadioBtn,pepIconSystemRotateDevice,pepIconSystemSearch,pepIconSystemSelect,pepIconSystemSettings,
        pepIconSystemSignature,pepIconSystemSpinner,pepIconSystemSupport,pepIconSystemTexterea,pepIconSystemTool,pepIconSystemView,pepIconTextAlignCenter,pepIconTextAlignLeft,pepIconTextAlignRight,pepIconTextLongText,pepIconTextShortText,pepIconTimeCal,pepIconTimeDatetime,pepIconTimeDuration,pepIconTimeTime,pepIconViewCardLg,pepIconViewCardMd,pepIconViewCardSm,pepIconViewLine,pepIconViewMatrix,pepIconViewTable } from '@pepperi-addons/ngx-lib/icon';
import { PepFlowPickerButtonModule } from '@pepperi-addons/ngx-composite-lib/flow-picker-button';
import { PepFieldTitleModule } from '@pepperi-addons/ngx-lib/field-title';

const pepIcons = [
    pepIconSystemMove,pepIconArrowBack,pepIconArrowBackRight,pepIconArrowDown, pepIconArrowDownAlt,pepIconArrowBackLeft, pepIconArrowEither, pepIconArrowLeft, pepIconArrowLeftAlt, pepIconArrowRight,pepIconArrowRightAlt, pepIconArrowTwoWaysHorL, pepIconArrowTwoWaysHorR,pepIconArrowTwoWaysVerB, pepIconArrowTwoWaysVerT,pepIconArrowUp, pepIconArrowUpAlt, pepIconBarndPepperi,pepIconDeviceDesktop,pepIconDeviceMobile,pepIconDeviceResponsive,pepIconDeviceTablet,pepIconIndicatorDotPlaceholder,pepIconLeafRound,pepIconLeafSkiny,pepIconMiscExcel,pepIconNoImage,pepIconNoImage2,pepIconNumberCoins,pepIconNumberDecimal,pepIconNumberDollar,pepIconNumberEuro,pepIconNumberMinus,pepIconNumberNumber,pepIconNumberPercent,pepIconNumberPlus,pepIconRipplesTransparent,pepIconShoppingCart,pepIconShoppingPaper,
    pepIconSystemAlert,pepIconSystemAttach,pepIconSystemAvatar,pepIconSystemBell,pepIconSystemBellOn,pepIconSystemBin,pepIconSystemBolt,pepIconSystemBoolean,pepIconSystemChat,pepIconSystemCircle,pepIconSystemClose,pepIconSystemCopy,pepIconSystemDoc,pepIconSystemDoor,pepIconSystemDotEllipsis,pepIconSystemEdit,pepIconSystemEducation,pepIconSystemEmail,pepIconSystemFileDownload,pepIconSystemFileUpload,pepIconSystemFileUploadCloud,pepIconSystemFilter,pepIconSystemFilter2,pepIconSystemFlag,pepIconSystemFolder,pepIconSystemFullScreen,pepIconSystemHeart,pepIconSystemHelp,pepIconSystemHome,pepIconSystemImage,pepIconSystemInfo,pepIconSystemInventory,pepIconSystemLink,pepIconSystemLock,pepIconSystemLogic,pepIconSystemMap,pepIconSystemMegaphone,pepIconSystemMenu,pepIconSystemMenuDots,pepIconSystemMust,
    pepIconSystemOffLine,pepIconSystemOk,pepIconSystemPause,pepIconSystemPhone,pepIconSystemPlay,pepIconSystemPrint,pepIconSystemProcessing,pepIconSystemQuestion,pepIconSystemRadioBtn,pepIconSystemRotateDevice,pepIconSystemSearch,pepIconSystemSelect,pepIconSystemSettings,pepIconSystemSignature,pepIconSystemSpinner,pepIconSystemSupport,pepIconSystemTexterea,pepIconSystemTool,pepIconSystemView,pepIconTextAlignCenter,pepIconTextAlignLeft,pepIconTextAlignRight,pepIconTextLongText,pepIconTextShortText,pepIconTimeCal,pepIconTimeDatetime,pepIconTimeDuration,pepIconTimeTime,pepIconViewCardLg,pepIconViewCardMd,pepIconViewCardSm,pepIconViewLine,pepIconViewMatrix,pepIconViewTable
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
        PepFieldTitleModule,

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
