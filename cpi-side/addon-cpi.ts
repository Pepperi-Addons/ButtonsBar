import '@pepperi-addons/cpi-node'
import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';
import ButtonsBarCpiService from './buttons-bar-cpi.service';

export async function load(configuration: any): Promise<void>{
       // check if flow configured to on load --> run flow (instaed of onload event)
       //if(configuration?.Data?.GalleryConfig?.OnLoadFlow){
       // const cpiService = new ButtonsBarCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        //const res: any = await cpiService.getOptionsFromFlow(configuration?.Data?.GalleryConfig.OnLoadFlow, {OnLoad: configuration}, req.context );
       //configuration = res?.configuration || configuration;
    //}
    return Promise.resolve();
}

export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
})

/**********************************  client events starts /**********************************/
pepperi.events.intercept(CLIENT_ACTION_ON_BUTTONS_BAR_CLICK as any, {}, async (data): Promise<any> => {
    const cpiService = new ButtonsBarCpiService();
    const res: any = await cpiService.getOptionsFromFlow(data.flow, data.parameters, data );
    return res;

});
/***********************************  client events ends /***********************************/
