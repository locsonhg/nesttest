interface SendMailTemplateParams {
  commenterName?: string;
  postTitle?: string;
  commentContent?: string;
  replierName?: string;
  content?: string;
  replyContent?: string;
  commentId?: number;
}

export const renderSendMailAuthorPost = ({
  commenterName,
  postTitle,
  commentContent,
}: SendMailTemplateParams) => {
  return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Comment on Your Post!</h2>
            <p><strong>${commenterName}</strong> has commented on your post: <em>${postTitle}</em></p>
            <p><strong>Comment:</strong></p>
            <blockquote style="margin-left: 20px; color: #555;">
                ${commentContent}
            </blockquote>
            <p>Visit your post to view and reply to the comment.</p>
            <p><a href="http://yourwebsite.com/posts/${encodeURIComponent(postTitle)}">Go to your post</a></p>
            <hr>
            <p>This is an automated message, please do not reply.</p>
        </div>
    `;
};

export const renderSendMailCommentReply = ({
  replierName,
  content,
  replyContent,
  commentId,
}: SendMailTemplateParams) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Bình luận của bạn có phản hồi mới!</h2>
      <p><strong>${replierName}</strong> đã trả lời bình luận của bạn:</p>
      <blockquote style="margin-left: 20px; color: #555;">
        "${content}"
      </blockquote>
      <p><strong>Phản hồi:</strong></p>
      <blockquote style="margin-left: 20px; color: #555;">
        ${replyContent}
      </blockquote>
      <p>Truy cập bài viết để xem và trả lời.</p>
      <p><a href="http://yourwebsite.com/comments/${commentId}">Đi đến bình luận của bạn</a></p>
      <hr>
      <p>Đây là một tin nhắn tự động, vui lòng không trả lời.</p>
    </div>
  `;
};
