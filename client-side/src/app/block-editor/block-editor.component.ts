import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ButtonsBarService } from 'src/services/buttons-bar.service';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import { IButtonsBar, ButtonEditor, IButtonsBarConfig, IEditorHostObject } from '../buttons-bar.model';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { FlowService } from 'src/services/flow.service';
import { Page, PageConfiguration } from '@pepperi-addons/papi-sdk';
import { v4 as uuid } from 'uuid';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { config } from '../app.config';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    
    @Input()
    set hostObject(value: IEditorHostObject) {
        if (value && value.configuration && Object.keys(value.configuration).length > 0) {
            // Override only if the configuration is not the same object
            if (JSON.stringify(this._configuration) !== JSON.stringify(value.configuration)) {
                this._configuration = value.configuration;
            }

            if(value.configurationSource && Object.keys(value.configuration).length > 0){
                // Override only if the configuration is not the same object
                if (JSON.stringify(this.configurationSource) !== JSON.stringify(value.configurationSource)) {
                    this.configurationSource = value.configurationSource;
                }
            }

            //prepare the flow host hobject
            this.flowHostObject = this.flowService.prepareFlowHostObject(this._configuration.ButtonsBarConfig.OnLoadFlow || null);  
        } else {
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }

        this.initPageConfiguration(value?.pageConfiguration);
        this._page = value?.page;
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);
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
                private flowService: FlowService,
                private pepAddonService: PepAddonService) {}

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

    private createNewButton(){
        let btn = new ButtonEditor();
        btn.Icon.Url = this.pepAddonService.getAddonStaticFolder(config.AddonUUID) + 'assets/images/' + 'system-bolt.svg';
        return btn;
    }
    
    private getDefaultButtons(numOfCards: number = 0): Array<ButtonEditor> {
        let buttons: Array<ButtonEditor> = [];
       
        for(var i=0; i < numOfCards; i++){
            let btn = this.createNewButton();
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
        let btn = this.createNewButton();
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

    onButtonDuplicateClick(event){
        let btn = new ButtonEditor;
        btn = JSON.parse(JSON.stringify(this.configuration.Buttons[event.id]));

        btn.id = (this.configuration?.Buttons.length);
        btn.ButtonKey = uuid();
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

    /***************   FLOW AND CONSUMER PARAMETERS START   ********************************/
    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));
        this.configuration.ButtonsBarConfig.OnLoadFlow = base64Flow;
        this.updateHostObjectField(`ButtonsBarConfig.OnLoadFlow`, base64Flow);
        this.updatePageConfigurationObject();
    }

    onButtonFlowChanged(event: any) {
        this.updatePageConfigurationObject();
    }

    private initPageConfiguration(value: PageConfiguration = null) {
        this._pageConfiguration = value || JSON.parse(JSON.stringify(this.defaultPageConfiguration));
    }

    private updatePageConfigurationObject() {
        this.initPageConfiguration();
    
        // Get the consume parameters keys from the filters.
        const consumeParametersKeys = this.getConsumeParametersKeys();
        this.addParametersToPageConfiguration(consumeParametersKeys, false, true);
        
        // After adding the params to the page configuration need to recalculate the page parameters.
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);

        this.emitSetPageConfiguration();
    }

    private getConsumeParametersKeys(): Map<string, string> {
        const parametersKeys = new Map<string, string>();

        // Move on all load flows
        const onLoadFlow = this.configuration?.ButtonsBarConfig?.OnLoadFlow || null;
        if (onLoadFlow) {
            let flowParams = JSON.parse(atob(onLoadFlow)).FlowParams;
            Object.keys(flowParams).forEach(key => {
                const param = flowParams[key];
                if (param.Source === 'Dynamic') {
                    parametersKeys.set(param.Value, param.Value);
                }
            });
        }
        
        // Move on all the buttons flows.
        for (let index = 0; index < this.configuration?.Buttons?.length; index++) {
            const btn = this.configuration.Buttons[index];
            if (btn?.Flow) {
                const flowParams = JSON.parse(atob(btn.Flow)).FlowParams || null;
                Object.keys(flowParams).forEach(key => {
                    const param = flowParams[key];
                    if (param.Source === 'Dynamic') {
                        parametersKeys.set(param.Value, param.Value);
                    }
                });
            }
        }

        return parametersKeys;
    }

    private addParametersToPageConfiguration(paramsMap: Map<string, string>, isProduce: boolean, isConsume: boolean) {
        const params = Array.from(paramsMap.values());

        // Add the parameters to page configuration.
        for (let index = 0; index < params.length; index++) {
            const parameterKey = params[index];
            if(parameterKey !== 'configuration'){
                const paramIndex = this._pageConfiguration.Parameters.findIndex(param => param.Key === parameterKey);

                // If the parameter exist, update the consume/produce.
                if (paramIndex >= 0) {
                    this._pageConfiguration.Parameters[paramIndex].Consume = this._pageConfiguration.Parameters[paramIndex].Consume || isConsume;
                    this._pageConfiguration.Parameters[paramIndex].Produce = this._pageConfiguration.Parameters[paramIndex].Produce || isProduce;
                } else {
                    // Add the parameter only if not exist.
                    this._pageConfiguration.Parameters.push({
                        Key: parameterKey,
                        Type: 'String',
                        Consume: isConsume,
                        Produce: isProduce
                    });
                }
            }
        }
    }

    private emitSetPageConfiguration() {
        this.hostEvents.emit({
            action: 'set-page-configuration',
            pageConfiguration: this._pageConfiguration
        });
    }
    /***************   FLOW AND CONSUMER PARAMETERS END   ********************************/
}
