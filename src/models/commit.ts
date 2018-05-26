import { Committer } from '../models/committer'

export class Commit {
    id: string;
    message: string;
    committer: Committer;
    distinct: boolean;
    timestamp: Date;
    modified: string[];
    added: string[];
    removed: string[];

    constructor(commit?: Commit) {
        this.id = commit.id;
        this.committer = commit.committer;
        this.timestamp = commit.timestamp;
        this.distinct = commit.distinct;
        this.added = commit.added || [];
        this.message = commit.message;
        this.modified = commit.modified || [];
        this.removed = commit.removed || [];
    }

    static get Builder() {
        class Builder {
            id;
            message;
            committer;
            distinct;
            timestamp;
            modified;
            added;
            removed;
            constructor(commitId) {
                this.id = commitId
            }
            withMessage(message) {
                this.message = message;
                return this;
            }
            withCommitter(committer) {
                this.committer = committer;
                return this;
            }
            withTimestamp(timestamp) {
                this.timestamp = timestamp;
                return this;
            }
            withDistinct(distinct) {
                this.distinct = distinct;
                return this;
            }
            withModified(modified) {
                this.modified = modified;
                return this;
            }
            withAdded(added) {
                this.added = added;
                return this;
            }
            withRemoved(removed) {
                this.removed = removed;
                return this;
            }
            build() {
                return new Commit(this);
            }
        }
        return Builder;
    }
}
