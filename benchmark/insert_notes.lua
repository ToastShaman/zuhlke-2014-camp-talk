counter = 0

request = function() 
    
    wrk.method = "POST"
    wrk.body = '{"title": "Hello World' .. counter .. '"}'
    wrk.headers["Content-Type"] = "application/json"
    counter = counter + 1
    return wrk.format(nill, "/notes")

end
