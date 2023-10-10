import '@pepperi-addons/cpi-node'
import * as _ from 'lodash'

//import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';
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
    const configuration = req?.body?.Configuration;
    let configurationRes = configuration;
    const state = req.body.State;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.ButtonsBarConfig?.OnLoadFlow){
        const cpiService = new ButtonsBarCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.ButtonsBarConfig.OnLoadFlow || [], state, req.context, configuration);
        configurationRes = result?.configuration || configuration;
    }
    const mergeState = Object.assign(Object.assign({}, state), {configuration: configurationRes});
    res.json({
        State: mergeState,
        Configuration: configurationRes,
    });
});

router.post('/run_button_click_event', async (req, res) => {
    const state = req.body.State;
    const btnID = req.body.ButtonKey;
    const configuration = state?.configuration || req?.body?.Configuration;
    let configurationRes = configuration;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.Buttons[btnID]?.Flow){
        const cpiService = new ButtonsBarCpiService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.Buttons[btnID].Flow || [], state, req.context, configuration);
        //Statechanges = _.differenceWith(_.toPairs(result.configuration), _.toPairs(configuration), _.isEqual);
        configurationRes = result?.configuration || configuration;
    }
    const mergeState = Object.assign(Object.assign({}, state), {configuration: configurationRes});
    res.json({
        State: mergeState,
        Configuration: configurationRes,
    });
});

router.post('/on_block_state_change', async (req, res) => {
    const state = req.body.State || {};
    const changes = req.body.Changes || {};
    //const configuration = req.body.Configuration;

    const mergeState = {...state, ...changes};
    res.json({
        State: mergeState,
        Configuration: changes,
    });
});
