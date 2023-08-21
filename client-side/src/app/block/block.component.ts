import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IButtonsBar, IHostObject } from '../buttons-bar.model';
import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';

@Component({
    selector: 'page-block', 
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() 
    set hostObject(value: IHostObject){
        this.configuration = value?.configuration;
        this.setBtnWidth();
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
        this.setBtnWidth();
    }

    ngOnChanges(e: any): void {

    }

    onButtonClick(event){
        
       const flowData = event.Flow || null;
       const parameters = {
            ButtonConfiguration: this.configuration
        }
        if(flowData){
        // Parse the params if exist.
        // const params = this.getScriptParams(event.ScriptData); 
            try{
                const eventData = {
                    detail: {
                        eventKey: CLIENT_ACTION_ON_BUTTONS_BAR_CLICK,
                        eventData: { flow: flowData, parameters: parameters },
                        completion: (res: any) => {
                                if (res) {
                                    debugger;
                                } else {
                                    // Show default error.
                                    debugger;
                                }
                            }
                    }
                };

                const customEvent = new CustomEvent('emit-event', eventData);
                window.dispatchEvent(customEvent);
            }
            catch(err){

            }
        }
    }

    setBtnWidth(){
        const btnStructure = this.configuration?.ButtonsBarConfig?.Structure || null;
        
        if(btnStructure){
            const gap = btnStructure?.Gap || 'none';
            const maxColumns = btnStructure?.MaxColumns || 2;
            const spacing = gap == 'none' ? '0px' : '(var(--pep-spacing-'+ gap +') * '+ (maxColumns - 1) +')';

            // this.columnTemplate = 'fr '.repeat(btnStructure.MaxColumns);
            // debugger;
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
            return {
                display: 'grid',
                'grid-template-columns': `repeat(${this.configuration.ButtonsBarConfig.Structure.MaxColumns}, ${size})`,
                'justify-content': this.configuration.ButtonsBarConfig.Structure.Alignment.Horizontal,
                'align-items': this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical == 'middle' ? 'center' : this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical
            };
        }
        // else{
        //     return {
        //         display: 'grid',
        //         'grid-template-columns': `repeat(${this.configuration.ButtonsBarConfig.Structure.MaxColumns}, 2)`,
        //         'justify-content': 'left',
        //         'align-items': this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical  == 'middle' ? 'center' : this.configuration.ButtonsBarConfig.Structure.Alignment.Vertical
        //       };
        // }
    }
}
