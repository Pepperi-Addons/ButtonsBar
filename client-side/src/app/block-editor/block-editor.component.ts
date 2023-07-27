import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonsBarService } from 'src/services/buttons-bar.service';
import { IGallery, IButtonsBar, ButtonEditor } from '../buttons-bar.model';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { CdkDragDrop, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';

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
    private _configuration: IGallery;
    get configuration(): IGallery {
        return this._configuration;
    }

    private blockLoaded = false;
    
    public configurationSource: IGallery;
    public widthTypes: Array<PepButton> = [];
    public verticalAlign : Array<PepButton> = [];
    public selectedButton: number = 0;
    
    

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private buttonsBarService: ButtonsBarService) {
        
    }

    ngOnInit(): void {

        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        this.widthTypes = [
            { key: 'dynamic', value: this.translate.instant('EDITOR.GENERAL.WIDTH_TYPES.DYNAMIC'), callback: (event: any) => this.onFieldChange('Structure.WidthType',event) },
            { key: 'set', value: this.translate.instant('EDITOR.GENERAL.WIDTH_TYPES.SET'), callback: (event: any) => this.onFieldChange('Structure.WidthType',event) },
            { key: 'stretch', value: this.translate.instant('EDITOR.GENERAL.WIDTH_TYPES.STRETCH'), callback: (event: any) => this.onFieldChange('Structure.WidthType',event) }
        ]

        this.verticalAlign = [
            { key: 'start', value: this.translate.instant('EDITOR.GENERAL.VERTICAL_ALIGN.TOP'), callback: (event: any) => this.onFieldChange('Structure.Alignment.Vertical',event) },
            { key: 'middle', value: this.translate.instant('EDITOR.GENERAL.VERTICAL_ALIGN.MIDDLE'), callback: (event: any) => this.onFieldChange('Structure.Alignment.Vertical',event) },
            { key: 'end', value: this.translate.instant('EDITOR.GENERAL.VERTICAL_ALIGN.BOTTOM'), callback: (event: any) => this.onFieldChange('Structure.Alignment.Vertical',event) }
        ]

        this.blockLoaded = true;
    }

    ngOnChanges(e: any): void {
    }

    onFieldChange(key, event){
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;

        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.ButtonsBarConfig[keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.ButtonsBarConfig[key] = value;
        }
  
        this.updateHostObjectField(`ButtonsBarConfig.${key}`, value);
    }

    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
    }

    private getDefaultHostObject(): IGallery {
        return { ButtonsBarConfig: new IButtonsBar(), Buttons: this.getDefaultButtons(2) };
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
        }
    }
    private getDefaultButtons(numOfCards: number = 0): Array<ButtonEditor> {
        let buttons: Array<ButtonEditor> = [];
       
        for(var i=0; i < numOfCards; i++){
            let card = new ButtonEditor();
            card.id = i;
            
            

            card.Title = this.getOrdinal(i+1) + this.translate.instant('GALLERY_EDITOR.ITEM');
            card.Description = this.translate.instant('GALLERY_EDITOR.AWESOMETEXTFORTHE') + ' ' + this.getOrdinal(i+1) + this.translate.instant('GALLERY_EDITOR.ITEM');
            buttons.push(card);
        }

        return buttons;
    }

    getOrdinal(n) {
        var s = ["th ", "st ", "nd ", "rd "];
        var v = n%100;
        return n + (s[(v-20)%10] || s[v] || s[0]);
    }

    addNewButtonClick() {
        // let card = new ICardEditor();
        // card.id = (this.configuration?.Cards.length);
        // card.Title = this.getOrdinal(card.id+1) + this.translate.instant('GALLERY_EDITOR.ITEM');
        // card.Description = this.translate.instant('GALLERY_EDITOR.AWESOMETEXTFORTHE') + ' ' + this.getOrdinal(card.id+1) + this.translate.instant('GALLERY_EDITOR.ITEM');
        
        // this.configuration?.Cards.push( card); 
        // this.updateHostObject();  
    }

    onButtonEditClick(event){
        this.selectedButton = this.selectedButton === event.id ? -1 :  parseInt(event.id);
    }

    onButtonRemoveClick(event){
       /* this.configuration?.Cards.splice(event.id, 1);
        this.configuration?.Cards.forEach(function(card, index, arr) {card.id = index; });
        this.updateHostObject();*/
    }

    drop(event: CdkDragDrop<string[]>) {
        // if (event.previousContainer === event.container) {
        //  moveItemInArray(this.configuration.Cards, event.previousIndex, event.currentIndex);
        //  for(let index = 0 ; index < this.configuration.Cards.length; index++){
        //     this.configuration.Cards[index].id = index;
        //  }
        //   this.updateHostObject();
        // } 
    }

    onDragStart(event: CdkDragStart) {
        //this.galleryService.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        //this.galleryService.changeCursorOnDragEnd();
    }
}
