import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PepStyleType, PepSizeType, PepColorService} from '@pepperi-addons/ngx-lib';
import { PepDialogActionButton, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepButton } from '@pepperi-addons/ngx-lib/button';
import { IGallery }  from '../../buttons-bar.model';
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

    @Input() configuration: IGallery;
    @Input() id: number;
    @Input() selectedButton: number;

    private _pageParameters: any = {};
    @Input()
    set pageParameters(value: any) {
        this._pageParameters = value;
    }

    public title: string;
    public cardFlowName = undefined;

    @Input() isDraggable = false;
    @Input() showActions = true;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    @Output() editClick: EventEmitter<any> = new EventEmitter();

    dialogRef: MatDialogRef<any>;
    
    constructor(
        private translate: TranslateService,
        private pepColorService: PepColorService,
        private pepDialogService: PepDialogService,
        private viewContainerRef: ViewContainerRef,
        private buttonsBarService: ButtonsBarService,
        private addonBlockLoaderService: PepAddonBlockLoaderService) {

    }

    async ngOnInit(): Promise<void> {
       /* const desktopTitle = await this.translate.get('SLIDESHOW.HEIGHTUNITS_REM').toPromise();   
        const card = this.configuration.Cards[this.id];
       
        if(card?.Flow){
            const flow = JSON.parse(atob(card?.Flow));
            this.cardFlowName = await this.buttonsBarService.getFlowName(flow?.FlowKey) || undefined;
        }*/
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
        debugger;
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration.Buttons[this.id][keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration.Buttons[this.id][key] = value;
        }

        this.updateHostObject();
    }

    private updateHostObject(updatePageConfiguration = false) {
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration,
            updatePageConfiguration: updatePageConfiguration
        });
    }

    onSlideshowFieldChange(key, event){/*
        if(event && event.source && event.source.key){
            this.configuration.GalleryConfig[key] = event.source.key;
        }
        else{
            this.configuration.GalleryConfig[key] = event;
        }

        this.updateHostObject();*/
    }

    onHostEvents(event: any) {/*
        if(event?.url) {
            this.configuration.Cards[this.id].AssetURL = "'"+ encodeURI(event.url) +"'";
            this.configuration.Cards[this.id].AssetKey = event.key;

            this.updateHostObject();
        }     */
    }

    openFlowPickerDialog() {/*
        const flow = this.configuration?.Cards[this.id]['Flow'] ?  JSON.parse(atob(this.configuration?.Cards[this.id]['Flow'])) : null;
        let hostObj = {};
        if(flow){
            hostObj = { 
                runFlowData: { 
                    FlowKey: flow.FlowKey, 
                    FlowParams: flow.FlowParams 
                },
                fields: {
                    OnLoad: {
                        Type: 'Object',
                    },
                    Test: {
                        Type: 'String'
                    }
                }
            };
        } else{
            hostObj = { 
                fields: {
                        OnLoad: {
                            Type: 'Object',
                        },
                        Test: {
                            Type: 'String'
                        }
                    },
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
                        this.configuration.Cards[this.id]['Flow'] = base64Flow;
                        this.updateHostObject(true);
                        this.dialogRef.close();
                        this.cardFlowName = await this.buttonsBarService.getFlowName(event.data.FlowKey) || undefined;
                } else if (event.action === 'on-cancel') {
                        this.dialogRef.close();
                }
            }
        })*/

    }

}
