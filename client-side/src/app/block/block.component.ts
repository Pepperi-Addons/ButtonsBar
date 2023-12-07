import { TranslateService } from '@ngx-translate/core';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IButtonsBar, IHostObject } from '../buttons-bar.model';
//import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';

@Component({
    selector: 'page-block', 
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit, AfterViewInit {
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
        this.hostEvents.emit({
            action: 'register-state-change',
            callback: this.registerStateChange.bind(this)
        });

        this.setBtnWidth();
    }

    ngOnChanges(changes) { 
        if (changes) {
        }
    }

    ngAfterViewInit() {
        this.setBadgeBackground();
    }

    private registerStateChange(data: {state: any, configuration: any}) {
        this.configuration = data.configuration;
        this.setBtnWidth();
        setTimeout(() => this.setBadgeBackground(), 1 );
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
    
    setBadgeBackground(){
        const badgeArr = document.querySelectorAll(".btn-bar-addon .mat-badge-content");
        badgeArr.forEach((badge, index) => {
            //badge['style'].backgroundColor = this.configuration.Buttons[index].Badge.Color;
            badge.setAttribute( 'style', 'background-color: '+ this.configuration.Buttons[index].Badge.Color +' !important' );
        })
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
        //setTimeout(function(){ this.setBadgeBackground() }, 1000);
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
