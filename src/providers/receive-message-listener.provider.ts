import {SendMessageCommand} from '@aws-sdk/client-sqs';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {Worker} from 'worker_threads';
import {TestDataSource} from '../datasources';
import {ackQueueUrl, client} from './send-message.provider';

export const fileCount = new Map<string, number>();

@injectable({scope: BindingScope.TRANSIENT})
export class ReceiveMessageListenerProvider implements Provider<() => void> {
  constructor(
    @inject('datasources.test') private dataSource: TestDataSource, // @inject('repositories.Test') private repo: TestRepository,
  ) {}

  value() {
    return () => this.receiveMessageListener();
  }

  receiveMessageListener() {
    const path = __dirname + '/receive-worker-file.js';
    const worker = new Worker(path);
    const worker2 = new Worker(path);
    worker.on('message', message => {
      // invoke save to db provider

      let command = `INSERT INTO public.test (id, first_name, last_name, gender, country, age, date, identity) VALUES `;
      message.data.rows.forEach(
        (
          row: {
            [x: string]: any;
            first_name: any;
            last_name: any;
            gender: any;
            country: any;
            age: any;
            date: any;
            Id: any;
          },
          index: number,
        ) => {
          const firstName = row['First Name'];
          const lastName = row['Last Name'];
          const gender = row['Gender'];
          const country = row['Country'];
          const age = row['Age'];
          const date = row.Date;
          const identity = row.Id;
          const id = row['0'];
          command += ` ('${id}'::bigint,
             '${firstName}'::character varying, '${lastName}'::character varying, '${gender}'::character varying, '${country}'::character varying, '${age}'::numeric,'${date}'::date,'${identity}'::numeric), `;
          if (index === message.data.rows.length - 1) {
            this.executeCommand(command.substring(0, command.length - 2));
          }
        },
      );

      const count =
        (fileCount.get(message.fileId) ?? 0) + message.data.rows.length;
      fileCount.set(message.fileId, count);

      if (count === message.totalRows) {
        const input = {
          QueueUrl: ackQueueUrl,
          MessageBody: message.fileId,
        };
        client.send(new SendMessageCommand(input));
        fileCount.set(message.fileId, 0);
      }
    });

    worker2.on('message', message => {
      // invoke save to db provider

      let command = `INSERT INTO public.test (id, first_name, last_name, gender, country, age, date, identity) VALUES `;
      message.data.rows.forEach(
        (
          row: {
            [x: string]: any;
            first_name: any;
            last_name: any;
            gender: any;
            country: any;
            age: any;
            date: any;
            Id: any;
          },
          index: number,
        ) => {
          const firstName = row['First Name'];
          const lastName = row['Last Name'];
          const gender = row['Gender'];
          const country = row['Country'];
          const age = row['Age'];
          const date = row.Date;
          const identity = row.Id;
          const id = row['0'];
          command += ` ('${id}'::bigint,
             '${firstName}'::character varying, '${lastName}'::character varying, '${gender}'::character varying, '${country}'::character varying, '${age}'::numeric,'${date}'::date,'${identity}'::numeric), `;
          if (index === message.data.rows.length - 1) {
            this.executeCommand(command.substring(0, command.length - 2));
          }
        },
      );

      const count =
        (fileCount.get(message.fileId) ?? 0) + message.data.rows.length;
      fileCount.set(message.fileId, count);

      if (count === message.totalRows) {
        const input = {
          QueueUrl: ackQueueUrl,
          MessageBody: message.fileId,
        };
        client.send(new SendMessageCommand(input));
        fileCount.set(message.fileId, 0);
      }
    });
  }
  async executeCommand(command: string) {
    try {
      await this.dataSource.execute(command);
      console.timeLog('receive');
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}
