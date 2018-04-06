export class Commit {
    id: string;
    message: string;
    modified: string[];
    added: string[];
    removed: string[];

    constructor(commit?: Commit) {
        this.id = commit.id;
        this.added = commit.added;
        this.message = commit.message;
        this.modified = commit.modified;
        this.removed = commit.removed;
    }

    static get Builder() {
        class Builder {
            id;
            message;
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
