
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 });

export default cache;
