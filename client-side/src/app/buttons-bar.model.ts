import { PepHorizontalAlignment, PepSizeType, PepStyleType} from "@pepperi-addons/ngx-lib";
import { PepShadowSettings} from "@pepperi-addons/ngx-composite-lib/shadow-settings";
import { PepColorSettings } from "@pepperi-addons/ngx-composite-lib/color-settings";
import { IconNameSubset, PepIconType } from "@pepperi-addons/ngx-lib/icon";
export type textColor = 'system-primary' | 'dimmed' | 'invert' | 'strong';
export type verticalAlignment = 'start' | 'middle' | 'end';
export type textPositionStyling = 'overlaid' | 'separated';
export type groupTitleAndDescription = 'grouped' | 'ungrouped';
export type iconPosition = 'start' | 'end';

export type WidthType = 'dynamic' | 'set' | 'stretch';

export class Alignment {
    Horizontal: PepHorizontalAlignment = 'left';
    Vertical: 'start' | 'middle' | 'end' = 'start';
}

export class ButtonLabel {
    UseLabel: boolean = true;
    Label: string = '';
}

export class ButtonIcon {
    UseIcon: boolean = false;
    Name: PepIconType = 'barnd_pepperi';
    Position: iconPosition = 'end';
}

export class ButtonBadge {
    UseBadge: boolean = false;
    LinkBadge: string = '';
}

export interface IHostObject {
    configuration: IButtonsBar;
    parameters: any;
}

export interface IButtonsBar{
    ButtonsBarConfig: IButtonsBarConfig,
    Buttons: Array<ButtonEditor>
}

export class Structure{
    MaxColumns: number = 2;
    Gap: PepSizeType = 'md';
    WidthType: WidthType = 'set';
    Width: number = 8; // rem
    Size: PepSizeType = 'md';
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

export class IButtonsBarConfig{
    Structure: Structure = new Structure();
    OnLoadFlow: any;
}

export class ButtonEditor {
    id: number;
    Label: ButtonLabel = new ButtonLabel();
    Style: PepStyleType = 'weak';
    Icon: ButtonIcon = new ButtonIcon();
    Badge: ButtonBadge = new ButtonBadge();
    Consumer: string = '';
    /*Title: string = "defaultTitle";
    Description: string = "defaultDescription";
    AssetKey: string = '';
    AssetURL: string = '';*/
    Flow: any;
}
