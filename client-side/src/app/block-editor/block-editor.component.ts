import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ButtonsBarService } from 'src/services/buttons-bar.service';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { IButtonsBar, ButtonEditor, IButtonsBarConfig, IEditorHostObject } from '../buttons-bar.model';
import { PepButton } from '@pepperi-addons/ngx-lib/button';

import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { FlowService } from 'src/services/flow.service';
import { Page, PageConfiguration } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    
    @Input()
    //set hostObject(value: any) {
    set hostObject(value: IEditorHostObject) {
        if (value && value.configuration && Object.keys(value.configuration).length > 0) {
            this._configuration = value.configuration
            if(value.configurationSource && Object.keys(value.configuration).length > 0){
                this.configurationSource = value.configurationSource;
            }
        } else {
            this.loadDefaultConfiguration();
        }

        this.initPageConfiguration(value?.pageConfiguration);
        this._page = value?.page;
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);
        
        //prepare the flow host hobject
        this.flowHostObject = this.flowService.prepareFlowHostObject(this._configuration.ButtonsBarConfig.OnLoadFlow || null);  
    }

    private _page: Page;
    get page(): Page {
        return this._page;
    }
    
    private _configuration: IButtonsBar;
    get configuration(): IButtonsBar {
        return this._configuration;
    }

    private blockLoaded = false;
    public configurationSource: IButtonsBar;
    public widthTypes: Array<PepButton> = [];
    public verticalAlign : Array<PepButton> = [];
    public selectedButton: number = -1;

    private defaultPageConfiguration: PageConfiguration = { "Parameters": []};
    private _pageConfiguration: PageConfiguration;

    flowHostObject;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private buttonsBarService: ButtonsBarService,
                private flowService: FlowService) {}

    async ngOnInit(): Promise<void> {

        const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();
        
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

    private initPageConfiguration(value: PageConfiguration = null) {
        this._pageConfiguration = value || JSON.parse(JSON.stringify(this.defaultPageConfiguration));
    }

    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
        this.flowHostObject = this.flowService.prepareFlowHostObject(this._configuration.ButtonsBarConfig.OnLoadFlow || null);  
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

    onBannerDuplicateClick(event){
        let btn = new ButtonEditor;
        btn = JSON.parse(JSON.stringify(this.configuration.Buttons[event.id]));

        btn.id = (this.configuration?.Buttons.length);
        this.configuration?.Buttons.push(btn);
        this._configuration = this.configuration
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

    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));
        this.configuration.ButtonsBarConfig.OnLoadFlow = base64Flow;
        this.updateHostObjectField(`ButtonsBarConfig.OnLoadFlow`, base64Flow);
    }
}
