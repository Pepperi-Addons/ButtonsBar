import { PepHorizontalAlignment, PepSizeType, PepStyleType} from "@pepperi-addons/ngx-lib";
import { v4 as uuid } from 'uuid';

import { Page } from "@pepperi-addons/papi-sdk";
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

export class Icon {
    UseIcon: boolean = false;
    Position: iconPosition = 'end';
    Url: string = '';
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

export class IButtonsBarConfig{
    Structure: Structure = new Structure();
    OnLoadFlow: any;
}

export class ButtonEditor {
    id: number;
    Label: ButtonLabel = new ButtonLabel();
    Style: PepStyleType = 'weak';
    Icon: Icon = new Icon();
    Badge: ButtonBadge = new ButtonBadge();
    Flow: any;
    ButtonKey: string = uuid();
}

export interface IEditorHostObject {
    state: any;
    configuration: IButtonsBar;
    configurationSource: IButtonsBar;
    pageConfiguration: any;
    page: Page
}
