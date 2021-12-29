import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';

import {
	apiRequest,
} from '../../../transport';

export async function del(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const body: IDataObject = {};
	const requestMethod = 'DELETE';

	//meta data
	const fileId: string = this.getNodeParameter('fileId', index) as string;

	//endpoint
	const endpoint = `files/${fileId}`;

	//response
	const responseData = await apiRequest.call(this, requestMethod, endpoint, body);

	//return
	return this.helpers.returnJsonArray({ statusCode: responseData.statusCode, statusMessage: responseData.statusMessage });
}