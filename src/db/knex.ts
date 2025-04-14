import { knex } from 'knex';
import config from '../config/knexfile';

const db = knex(config);
export default db;
