export type User = {
    id: number,
    username: string,
    avatar_url: string,
}

export type Feed = {
    user: User,
    id: number,
    title: string,
    content: string,
    image_urls: string[],
    publishedAt: Date,
    like_count: number,
    comment_count: number,
    collect_count: number,
    isLiked: boolean,
    created_at_friendly: string,
}

export type PaginationData<T> = {
    items: T[],
    meta: {
      totalPages: number,
      total?: number,
      limit?: number,
      nextPage?: number,
      page?: number,
    }
}

export type UserProfileData = {
    id: number;
    username: string;
    avatar_url: string;
    description: string;
    gender: string;
    interactionInfo: {
        isFollowing: boolean;
        followingCount: number;
        followerCount: number;
        receivedLikeCount: number;
        receivedCollectCount: number;
    }
}

export type CommentInfo = {
    id: number;
    content: string;
    created_at: Date;
    user: User;
    children?: CommentInfo[];
    parent?: CommentInfo;
    created_at_friendly?: string;
}

export type PostInfo = Feed;
