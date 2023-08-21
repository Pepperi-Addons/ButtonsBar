import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ButtonsBarService } from 'src/services/buttons-bar.service';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { IButtonsBar, ButtonEditor, IButtonsBarConfig } from '../buttons-bar.model';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { MatDialogRef } from '@angular/material/dialog';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    
    @Input()
    set hostObject(value: any) {
        if (value && value.configuration && Object.keys(value.configuration).length) {
                this._configuration = value.configuration;
                if(value.configurationSource && Object.keys(value.configuration).length > 0){
                    this.configurationSource = value.configurationSource;
                }  
        } else {
            // TODO - NEED TO ADD DEFAULT CARD
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }
        
        //this._pageParameters = value?.pageParameters || {};
       //this._pageConfiguration = value?.pageConfiguration || this.defaultPageConfiguration;
    }
    private _configuration: IButtonsBar;
    get configuration(): IButtonsBar {
        return this._configuration;
    }

    private blockLoaded = false;
    public onloadFlowName = undefined;
    public configurationSource: IButtonsBar;
    public widthTypes: Array<PepButton> = [];
    public verticalAlign : Array<PepButton> = [];
    public selectedButton: number = 0;
    
    private dialogRef: MatDialogRef<any>;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private buttonsBarService: ButtonsBarService,
                private viewContainerRef: ViewContainerRef,
                private addonBlockLoaderService: PepAddonBlockLoaderService,) {
        
    }

    ngOnInit() {

        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        this.widthTypes = [
            { key: 'dynamic', value: this.translate.instant('EDITOR.GENERAL.WIDTH_TYPES.DYNAMIC'), callback: (event: any) => this.onFieldChange('WidthType',event) },
            { key: 'set', value: this.translate.instant('EDITOR.GENERAL.WIDTH_TYPES.SET'), callback: (event: any) => this.onFieldChange('WidthType',event) },
            { key: 'stretch', value: this.translate.instant('EDITOR.GENERAL.WIDTH_TYPES.STRETCH'), callback: (event: any) => this.onFieldChange('WidthType',event) }
        ]

        this.verticalAlign = [
            { key: 'start', value: this.translate.instant('EDITOR.GENERAL.VERTICAL_ALIGN.TOP'), callback: (event: any) => this.onFieldChange('Alignment.Vertical',event) },
            { key: 'middle', value: this.translate.instant('EDITOR.GENERAL.VERTICAL_ALIGN.MIDDLE'), callback: (event: any) => this.onFieldChange('Alignment.Vertical',event) },
            { key: 'end', value: this.translate.instant('EDITOR.GENERAL.VERTICAL_ALIGN.BOTTOM'), callback: (event: any) => this.onFieldChange('Alignment.Vertical',event) }
        ]

        this.blockLoaded = true;
    }

    async ngOnChanges(e: any): Promise<void> {
        if(this.configuration?.ButtonsBarConfig?.OnLoadFlow){
            const flow = JSON.parse(atob(this.configuration.ButtonsBarConfig.OnLoadFlow));
            this.onloadFlowName = await this.buttonsBarService.getFlowName(flow.FlowKey);
        }
    }

    onFieldChange(key, event){
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
 
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.ButtonsBarConfig.Structure[keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.ButtonsBarConfig.Structure[key] = value;
        }
  
        this.updateHostObjectField(`ButtonsBarConfig.Structure.${key}`, value);
    }

    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
    }

    private getDefaultHostObject(): IButtonsBar {
        return { ButtonsBarConfig: new IButtonsBarConfig(), Buttons: this.getDefaultButtons(2) };
    }

    private updateHostObject() {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }

    private updateHostObjectField(fieldKey: string, value: any) {
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey, 
            value: value
        });
    }

    public onHostObjectChange(event) {
        if(event && event.action) {
            if (event.action === 'set-configuration') {
                this._configuration = event.configuration;
                this.updateHostObject();

                // Update page configuration only if updatePageConfiguration
                if (event.updatePageConfiguration) { // TODO - CHECK IF NEED
                    //this.updatePageConfigurationObject();
                }
            }
            if(event.action === 'set-configuration-field'){
                this.updateHostObjectField(event.key, event.value);
            }
        }
    }
    private getDefaultButtons(numOfCards: number = 0): Array<ButtonEditor> {
        let buttons: Array<ButtonEditor> = [];
       
        for(var i=0; i < numOfCards; i++){
            let btn = new ButtonEditor();
            btn.id = i;
            
            

            btn.Label.Label = this.getOrdinal(i+1) + this.translate.instant('EDITOR.GENERAL.BUTTON');
            //card.Description = this.translate.instant('GALLERY_EDITOR.AWESOMETEXTFORTHE') + ' ' + this.getOrdinal(i+1) + this.translate.instant('GALLERY_EDITOR.ITEM');
            buttons.push(btn);
        }

        return buttons;
    }

    getOrdinal(n) {
        var s = ["th ", "st ", "nd ", "rd "];
        var v = n%100;
        return n + (s[(v-20)%10] || s[v] || s[0]);
    }

    addNewButtonClick() {
        let btn = new ButtonEditor();
        btn.id = (this.configuration?.Buttons.length);
        btn.Label.Label = this.getOrdinal(btn.id+1) + this.translate.instant('EDITOR.GENERAL.BUTTON');
        
        this.configuration?.Buttons.push(btn);
        this.updateHostObject();  
    }

    onButtonEditClick(event){
        this.selectedButton = this.selectedButton === event.id ? -1 :  parseInt(event.id);
    }

    onButtonRemoveClick(event){
       this.configuration?.Buttons.splice(event.id, 1);
       this.configuration?.Buttons.forEach(function(btn, index, arr) {btn.id = index; });
       this.updateHostObject();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
         moveItemInArray(this.configuration.Buttons, event.previousIndex, event.currentIndex);
         for(let index = 0 ; index < this.configuration.Buttons.length; index++){
            this.configuration.Buttons[index].id = index;
         }
          this.updateHostObject();
        } 
    }

    onDragStart(event: CdkDragStart) {
        this.buttonsBarService.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        this.buttonsBarService.changeCursorOnDragStart();
    }

    openFlowPickerDialog() {
        const flow = this.configuration?.ButtonsBarConfig?.OnLoadFlow ? JSON.parse(atob(this.configuration.ButtonsBarConfig.OnLoadFlow)) : null;
        debugger;
        let hostObj = {};
        if(flow){
            hostObj = { 
                runFlowData: { 
                    FlowKey: flow.FlowKey, 
                    FlowParams: flow.FlowParams 
                },
                fields: {
                    OnLoad: {
                        Type: 'Object'
                    }
                }
            };
        } else{
            hostObj = { 
                fields: {
                        OnLoad: {
                            Type: 'Object'
                        }
                    }
                }
        }

        this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'FlowPicker',
            size: 'large',
            hostObject: hostObj,
            hostEventsCallback: async (event) => {
                if (event.action === 'on-done') {
                        const base64Flow = btoa(JSON.stringify(event.data));
                        this.configuration.ButtonsBarConfig.OnLoadFlow = base64Flow;
                        this.updateHostObjectField(`ButtonsBarConfig.OnLoadFlow`, base64Flow);
                        this.onloadFlowName = await this.buttonsBarService.getFlowName(event.data.FlowKey);
                        this.dialogRef.close();
                } else if (event.action === 'on-cancel') {
                        this.dialogRef.close();
                }
            }
        });
    }
}
