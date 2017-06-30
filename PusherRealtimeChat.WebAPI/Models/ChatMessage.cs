using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PusherRealtimeChat.WebAPI.Models
{
    public class ChatMessage
    {
        [Required]
        public string Text { get; set; }

        [Required]
        public string AuthorTwitterHandle { get; set; }
    }
}