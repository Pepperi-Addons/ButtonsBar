import { FlowObject, RunFlowBody } from '@pepperi-addons/cpi-node';
import { IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';

class ButtonsBarCpiService {
    /***********************************************************************************************/
    //                              Private functions
    /************************************************************************************************/
    public async getOptionsFromFlow(flow: any, configuration: any, context: IContext | undefined): Promise<Array<{ Key: string, Title: string }>> {
        const res: any = { Options: [] };

        const flowData: FlowObject = flow ? JSON.parse(Buffer.from(flow, 'base64').toString('utf8')) : {};
        if (flowData?.FlowKey?.length > 0) {
            flowData.FlowParams['configuration'] = {Source: 'Dynamic', Value: 'configuration' };
            const dynamicParamsData: any = {};

            if (flowData?.FlowParams) {
                const dynamicParams: any = [];

                // Get all dynamic parameters to set their value on the data property later.
                const keysArr = Object.keys(flowData.FlowParams);
                for (let index = 0; index < keysArr.length; index++) {
                    const key = keysArr[index];

                    if (flowData.FlowParams[key].Source === 'Dynamic') {
                        dynamicParams.push(flowData.FlowParams[key].Value);
                    }
                }
                // Set the dynamic parameters values on the dynamicParamsData property.
                for (let index = 0; index < dynamicParams.length; index++) {
                    const param = dynamicParams[index];
                    dynamicParamsData[param] = configuration[param] || '';
                }
            }
            const flowToRun: RunFlowBody = {
                RunFlow: flowData,
                Data: dynamicParamsData,
                context: context
            };

            // Run the flow and return the options.
            const flowRes = await pepperi.flows.run(flowToRun);
            res.Options = flowRes || [];
        }
        return res.Options;
    }
     /***********************************************************************************************/
    //                              Public functions
    /************************************************************************************************/
}
export default ButtonsBarCpiService;
