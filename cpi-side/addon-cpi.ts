import '@pepperi-addons/cpi-node'
import { CLIENT_ACTION_ON_BUTTONS_BAR_CLICK } from 'shared';
import ButtonsBarCpiService from './buttons-bar-cpi.service';

export async function load(configuration: any): Promise<void>{
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
