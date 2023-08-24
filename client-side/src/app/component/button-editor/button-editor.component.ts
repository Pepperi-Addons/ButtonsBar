import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepStyleType, PepSizeType, PepColorService} from '@pepperi-addons/ngx-lib';
import { PepDialogActionButton, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { ButtonEditor, IButtonsBar, IButtonsBarConfig }  from '../../buttons-bar.model';
import { MatDialogRef } from '@angular/material/dialog';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { ButtonsBarService } from 'src/services/buttons-bar.service';

interface groupButtonArray {
    key: string; 
    value: string;
}

@Component({
    selector: 'button-editor',
    templateUrl: './button-editor.component.html',
    styleUrls: ['./button-editor.component.scss']
})
export class ButtonEditorComponent implements OnInit {

    @Input() configuration: ButtonEditor;
    @Input() id: number;
    @Input() selectedButton: number;

    private _pageParameters: any = {};
    @Input()
    set pageParameters(value: any) {
        this._pageParameters = value;
    }

    public title: string;

    @Input() isDraggable = false;
    @Input() showActions = true;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() editClick: EventEmitter<any> = new EventEmitter();

    dialogRef: MatDialogRef<any>;
    iconslist: Array<string> = ['system_move','arrow_back','arrow_back_right','arrow_back_left','arrow_down', 'arrow_down_alt', 'arrow_either', 'arrow_left', 'arrow_left_alt', 'arrow_right','arrow_right_alt', 
             'arrow_two_ways_hor_l', 'arrow_two_ways_hor_r','arrow_two_ways_ver_b', 'arrow_two_ways_ver_t','arrow_up', 'arrow_up_alt', 'brand_pepperi','device_desktop','device_mobile','device_responsive','device_tablet','indicator_dot_placeholder','leaf_round','leaf_skiny','misc_excel','no_image','no_image_2','number_coins','number_decimal','number_dollar','number_euro','number_minus','number_number','number_percent','number_plus','ripples_transparent','shopping_cart','shopping_paper',
             'system_alert','system_attach','system_avatar','system_bell','system_bell_on','system_bin','system_bolt','system_boolean','system_chat','system_circle','system_close','system_copy','system_doc','system_door','system_dot_ellipsis','system_edit','system_education','system_email','system_file_download','system_file_upload','system_file_upload_cloud','system_filter','system_filter_2','system_flag','system_folder','system_full_screen','system_heart','system_help','system_home','system_image','system_info','system_inventory','system_link','system_lock','system_logic','system_map','system_megaphone','system_menu','system_menu_dots','system_must',
             'system_off_line','system_ok','system_pause','system_phone','system_play','system_print','system_processing','system_question','system_radio_btn','system_rotate_device','system_search','system_select','system_settings','system_signature','system_spinner','system_support','system_texterea','system_tool','system_view','text_align_center','text_align_left','text_align_right','text_long_text','text_short_text','time_cal','time_datetime','time_duration','time_time','view_card_lg','view_card_md','view_card_sm','view_line','view_matrix,view_table']
    
    buttonStyles: Array<PepButton> = [];
    iconNames: Array<PepButton> = [];
    iconPosition: Array<PepButton> = [];
    flowHostObject;

    constructor(
        private translate: TranslateService,
        private pepColorService: PepColorService,
        private pepDialogService: PepDialogService,
        private viewContainerRef: ViewContainerRef,
        private buttonsBarService: ButtonsBarService,
        private addonBlockLoaderService: PepAddonBlockLoaderService) {

    }

    async ngOnInit(): Promise<void> {

        this.buttonStyles = [
            { key: 'weak', value: this.translate.instant('EDITOR.CONTENT.STYLES.WEAK')},
            { key: 'regular', value: this.translate.instant('EDITOR.CONTENT.STYLES.REGULAR')},
            { key: 'strong', value: this.translate.instant('EDITOR.CONTENT.STYLES.STRONG')} 
        ];

        this.iconslist.forEach(icon => {
            this.iconNames.push({ key: icon, value: icon})
        });

        this.iconPosition = [
            { key: 'start', value: this.translate.instant('EDITOR.CONTENT.ICON.POSITION.START'), callback: (event: any) => this.onFieldChange('Icon.Position',event) },
            { key: 'end', value: this.translate.instant('EDITOR.CONTENT.ICON.POSITION.END'), callback: (event: any) => this.onFieldChange('Icon.Position',event) }
        ]

        this.prepareFlowHostObject();
    }

    getOrdinal(n) {
        var s = ["th ", "st ", "nd ", "rd "];
        var v = n%100;
        return n + (s[(v-20)%10] || s[v] || s[0]);
    }

    onRemoveClick() {
        this.removeClick.emit({id: this.id});
    }

    onEditClick() {
        this.editClick.emit({id: this.id});
    }

    onFieldChange(key, event){
        const value = key.indexOf('image') > -1 && key.indexOf('src') > -1 ? event.fileStr :  event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration[keyObj[0]][keyObj[1]] = value;
            this.updateHostObjectField(`Buttons[${this.id}][${keyObj[0]}][${keyObj[1]}]`, value);
        }
        else{
            this.configuration[key] = value;
            this.updateHostObjectField(`Buttons[${this.id}][${key}]`, value);
            
        }
    }

    private updateHostObject(updatePageConfiguration = false) {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration,
            updatePageConfiguration: updatePageConfiguration
        });
    }

    private updateHostObjectField(fieldKey: string, value: any) {
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey, 
            value: value
        });
    }

    private prepareFlowHostObject() {
        this.flowHostObject = {};
        const runFlowData = this.configuration?.Flow  ?  JSON.parse(atob(this.configuration.Flow)) : null;
        const fields = {};

        if (runFlowData) {
            this.buttonsBarService.flowDynamicParameters.forEach((value, key) => {
                fields[key] = {
                    Type: value || 'String'
                };
            });
        }
        
        this.flowHostObject['runFlowData'] = runFlowData?.FlowKey ? runFlowData : undefined;
        this.flowHostObject['fields'] = fields;
    }

    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));

        this.configuration.Flow = base64Flow;
        this.updateHostObjectField(`Buttons[${this.id}]['Flow']`, base64Flow);
    }

}
