import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IButtonsBar, IHostObject } from '../buttons-bar.model';
//import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';

@Component({
    selector: 'page-block', 
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() 
    set hostObject(value: IHostObject){
        if(value?.configuration && Object.keys(value.configuration).length){
            this.configuration = value?.configuration;
            this.setBtnWidth();
        }
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    private _configuration: IButtonsBar;
    get configuration(): IButtonsBar {
        return this._configuration;
    }
    set configuration(conf: IButtonsBar){
        this._configuration = conf;
    }

    public btnWidth: string;
    public columnTemplate: string;
    constructor(private translate: TranslateService) {
    
    }

    @HostListener('window:resize')
    public onWindowResize() {
        this.setBtnWidth();
    }
    
    ngOnInit(): void {

        this.hostEvents.emit({
            action: 'register-state-change',
            callback: this.registerStateChange.bind(this)
        });

        this.setBtnWidth();
    }

    private registerStateChange(data: {state: any, configuration: any}) {
        if(!this.configuration && data?.configuration){
            this.configuration = data.configuration;
        }
        else if(data?.configuration){
            this.mergeConfiguration(data.configuration);
        }
        this.setBtnWidth();
        
    }

    private mergeConfiguration(newConfiguration){
        for (const prop in this.configuration) {
            // skip loop if the property dont exits on new object
            if (!newConfiguration.hasOwnProperty(prop)) continue;
            //update configuration with the object from new object
            this.configuration[prop] = newConfiguration[prop]; 
        }
    }

    onButtonClick(event){
        //check if button has flow
        if(event?.Flow && event.ButtonKey){
            this.hostEvents.emit({
                action: 'button-click',
                buttonKey: event.ButtonKey
            })
        }
    }
    
    setBtnWidth(){
        const btnStructure = this.configuration?.ButtonsBarConfig?.Structure || null;
        
        if(btnStructure){
            const gap = btnStructure?.Gap || 'none';
            const maxColumns = btnStructure?.MaxColumns || 2;
            const spacing = gap == 'none' ? '0px' : '(var(--pep-spacing-'+ gap +') * '+ (maxColumns - 1) +')';

            switch(btnStructure.WidthType){
                case 'set': {
                    this.btnWidth = btnStructure.Width.toString() + 'rem';
                    break;
                }
                case 'stretch': {
                    this.btnWidth = '100%'
                    break;
                }
                case 'dynamic': {
                    this.btnWidth = 'max-content';
                    break;
                }
            }
        }
    }

    getStyles(){
        const widthType = this.configuration?.ButtonsBarConfig?.Structure?.WidthType || null;
        if(widthType){
            const size = widthType === 'set' ? 'min-content' : widthType === 'stretch' ? '1fr' : 'max-content'
            const alignCont = this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical == 'middle' ? 'center' : this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical;
            return {
                display: 'grid',
                'grid-template-columns': `repeat(${this.configuration.ButtonsBarConfig.Structure.MaxColumns}, ${size})`,
                'justify-content': this.configuration.ButtonsBarConfig.Structure.Alignment.Horizontal,
                'align-content': alignCont, 
                'align-items': this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical == 'middle' ? 'center' : this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical
            };
        }
    }
}
