import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepStyleType, PepSizeType, PepColorService} from '@pepperi-addons/ngx-lib';
import { PepDialogActionButton, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { ButtonEditor, IButtonsBar, IButtonsBarConfig }  from '../../buttons-bar.model';
import { MatDialogRef } from '@angular/material/dialog';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { ButtonsBarService } from 'src/services/buttons-bar.service';
import { FlowService } from '../../../services/flow.service';
import { IPepMenuItemClickEvent, PepMenuItem, PepMenuItemType } from '@pepperi-addons/ngx-lib/menu';
import { PepInternalMenuItem } from '@pepperi-addons/ngx-lib/menu/menu-item.component';

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
    @Output() duplicateClick: EventEmitter<any> = new EventEmitter();
    @Output() flowChange: EventEmitter<any> = new EventEmitter();
    
    dialogRef: MatDialogRef<any>;

    buttonStyles: Array<PepButton> = [];

    iconPosition: Array<PepButton> = [];
    flowHostObject;

    actionsMenu: Array<PepMenuItem> = [];

    constructor(
        private translate: TranslateService,
        private flowService: FlowService,
        private buttonsBarService: ButtonsBarService) {

    }

    async ngOnInit(): Promise<void> {

        this.buttonStyles = [
            { key: 'weak', value: this.translate.instant('EDITOR.CONTENT.STYLES.WEAK')},
            { key: 'regular', value: this.translate.instant('EDITOR.CONTENT.STYLES.REGULAR')},
            { key: 'strong', value: this.translate.instant('EDITOR.CONTENT.STYLES.STRONG')} 
        ];

        this.iconPosition = [
            { key: 'start', value: this.translate.instant('EDITOR.CONTENT.ICON.POSITION.START'), callback: (event: any) => this.onFieldChange('Icon.Position',event) },
            { key: 'end', value: this.translate.instant('EDITOR.CONTENT.ICON.POSITION.END'), callback: (event: any) => this.onFieldChange('Icon.Position',event) }
        ]
        
        this.actionsMenu = [
            { key: 'duplicate', text: this.translate.instant('EDITOR.CONTENT.DUPLICATE') },
            { key: 'delete', text: this.translate.instant('EDITOR.CONTENT.DELETE') }
        ]

        this.flowHostObject = this.flowService.prepareFlowHostObject((this.configuration?.Flow || null)); 
    }

    getOrdinal(n) {
        var s = ["th ", "st ", "nd ", "rd "];
        var v = n%100;
        return n + (s[(v-20)%10] || s[v] || s[0]);
    }

    onMenuItemClick(item: IPepMenuItemClickEvent){
        if(item?.source?.key == 'delete'){
            this.removeClick.emit({id: this.id});
        }
        else if(item?.source?.key == 'duplicate'){
            this.duplicateClick.emit({id: this.id});
        }
    }

    onEditClick(event) {
        this.editClick.emit({id: event ? this.id : -1});
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

    private updateHostObjectField(fieldKey: string, value: any) {
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey, 
            value: value
        });
    }

    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));
        this.configuration.Flow = base64Flow;
        this.updateHostObjectField(`Buttons[${this.id}]['Flow']`, base64Flow);
        this.flowChange.emit();
    }

    onIconChange(event){
        this.configuration.Icon.Url = event.url;
        this.onFieldChange('Icon.Url', event?.url );
    }

    onUseIconChange(event: boolean){
        this.onFieldChange('Icon.UseIcon',event);
    }

}
