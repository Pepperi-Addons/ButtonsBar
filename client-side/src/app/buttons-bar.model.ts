import { PepHorizontalAlignment, PepSizeType} from "@pepperi-addons/ngx-lib";
import { PepShadowSettings} from "@pepperi-addons/ngx-composite-lib/shadow-settings";
import { PepColorSettings } from "@pepperi-addons/ngx-composite-lib/color-settings";
export type textColor = 'system-primary' | 'dimmed' | 'invert' | 'strong';
export type verticalAlignment = 'start' | 'middle' | 'end';
export type textPositionStyling = 'overlaid' | 'separated';
export type groupTitleAndDescription = 'grouped' | 'ungrouped';


export type WidthType = 'dynamic' | 'set' | 'stretch';

export class Alignment {
    Horizontal: PepHorizontalAlignment = 'left';
    Vertical: 'start' | 'middle' | 'end' = 'start';
}

export class ButtonLabel {
    UseLabel: boolean = false;
    Label: string = '';
}

export interface IHostObject {
    configuration: IGallery;
    parameters: any;
}

export interface IGallery{
    ButtonsBarConfig: IButtonsBar,
    Buttons: Array<ButtonEditor>
}

export class Structure{
    MaxColumns: number = 2;
    Gap: PepSizeType = 'md';
    WidthType: WidthType = 'set';
    Width: number = 8; // rem
    Alignment: Alignment = new Alignment();
}

// export class Button {
//     Height: number = 16;
//     TextColor: textColor = 'system-primary';
//     Border: PepColorSettings = new PepColorSettings();
//     DropShadow: PepShadowSettings = new PepShadowSettings();
//     UseRoundCorners: boolean = true;
//     RoundCornersSize: PepSizeType = 'md';
// }

export class IButtonsBar{
    Structure: Structure = new Structure();
    OnLoadFlow: any;
}

export class ButtonEditor {
    id: number;
    Label: ButtonLabel = new ButtonLabel();

    Title: string = "defaultTitle";
    Description: string = "defaultDescription";
    AssetKey: string = '';
    AssetURL: string = '';
    Flow: any;
}
