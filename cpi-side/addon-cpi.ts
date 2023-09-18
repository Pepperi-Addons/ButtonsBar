import '@pepperi-addons/cpi-node'
import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';
import ButtonsBarCpiService from './buttons-bar-cpi.service';

export async function load(configuration: any): Promise<void>{
    return Promise.resolve();
}

export const router = Router()
// router.get('/test', (req, res) => {
//     res.json({
//         hello: 'World'
//     })
// })

router.post('/run_on_load_event', async (req, res) => {
    let configuration = req?.body?.Configuration;
    const state = req.body.State;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.ButtonsBarConfig?.OnLoadFlow){
        const cpiService = new ButtonsBarCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.ButtonsBarConfig.OnLoadFlow || [], state, req.context, configuration);
        configuration = result?.configuration || configuration;
    }
    res.json({Configuration: configuration});
});

/**********************************  client events starts /**********************************/
pepperi.events.intercept(CLIENT_ACTION_ON_BUTTONS_BAR_CLICK as any, {}, async (data): Promise<any> => {
    const cpiService = new ButtonsBarCpiService();
    const res: any = await cpiService.getOptionsFromFlow(data.flow, data.parameters, data, data.parameters.configuration );
    return res;
});
/***********************************  client events ends /***********************************/
