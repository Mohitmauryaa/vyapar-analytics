import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://gucfmpkemvuxgbbgedcp.supabase.co'
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Y2ZtcGtlbXZ1eGdiYmdlZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTM2NTMsImV4cCI6MjA5NTI2OTY1M30.AKPAzlQxpRzeZgo2-56mxe0tiX7RsFWjCIhvn7GIdx8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)