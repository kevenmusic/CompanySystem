﻿namespace CompanySystem.Domain.Extension
{
    public static class ErrorExtensions
    {
        public static string ToText(this Exception exception)
        {
            return $"{exception.Message} {exception.StackTrace} {exception.InnerException?.Message} {exception.InnerException?.StackTrace}";
        }
    }
}
