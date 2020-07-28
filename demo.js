/*
// regpack options
{
  withMath: false,
  hash2DContext: true,
  hashWebGLContext: true,
  hashAudioContext: true,
  contextVariableName: "c",
  contextType: 0,
  reassignVars: true,
  varsNotReassigned: "a b c d", // js1024
  crushGainFactor: 2,
  crushLengthFactor: 2,
  crushCopiesFactor: 1,
  crushTiebreakerFactor: 1,
  wrapInSetInterval: false,
  timeVariableName: "t",
  useES6: true
}
*/

p=[]
F=400
V=650
W=220
N=100
B=t=0
S=16
T=30
Q=1500
f=.2

// color list
X=[
    [W,W,N],    // terrain
    [N,W,W],    // water
    [W,W,W],    // snow
    [W,S,S]     // balloon red color
]

// draw function (array, offset, linespan, length, time(for animation), alpha)
dr=(q,p,m,l,t,A)=>{
    // run the loop twice to reuse as much variables and loops as possible
    // the first iteration will do the projection
    // while the second iteration will do the actual rendering
    for(g=2;g--;)
        for(j=0,k=p;j<(t?l:g?l:1);k++){
            //if it's water animate it slightly
            K=(q[k].y>=Q?40:0)*Math.sin(j+++t*.06)
            z = q[k].z -t*f+K
            if(g) {
                // calculate projection
                q[k].X=F*(q[k].x)/z + a.width/2
                q[k].Y=F*(q[k].y+K)/z + (t?a.height/2:N)
            } else {
                // if any quad is behind the field of view enable
                // to remove one line after all rendering has been done.
                Z|=z <= N
                C=X[q[k].c]

                // quick & dirty cross product to do lighting calculations
                e=q[k+m].y-q[k].y
                d=q[k+m].z-q[k].z
                h=q[k+1].x-q[k].x
                u=[e-d*(q[k+1].y-q[k].y), d*h, -e*h]
                u=u.map(e=>e/Math.hypot(u[0],u[1],u[2]))
                
                // factor current color by lighting calc. approx
                // (40% ambient + 60% lighting)
                u=.4+.6*(u[0]*f+(t?u[1]:u[1]*f+u[2]))
                c.fillStyle='rgba(' + C[0]*u + ',' + C[1]*u + ',' + C[2]*u + ','+A+')'
                
                c.beginPath()
                c.lineTo(q[k].X,    q[k].Y)
                c.lineTo(q[k+1].X,  q[k+1].Y)
                c.lineTo(q[k+m+1].X,q[k+m+1].Y)
                c.lineTo(q[k+m].X,  q[k+m].Y)
                c.fill()
            }
        }
}

setInterval(()=>{
    with(Math) {
    // clear the screen
    c.fillStyle='#28a'
    c.fillRect(0,0,a.width,a.height)

    //small cloud! - did not fit under 1k =)
    // c.fillStyle='rgba(255,255,255,.5)'
    // for(i=S;i;){
    //     k=Math.sin(i--*S+t*.0001)
    //     c.beginPath()
    //     c.arc(N+i*8,N+S*k,T+T*k,0,6)
    //     c.fill()
    // }

    // generate lines of terrain until we have N
    for(;(A=p.length)<N*N;B++) {
        // N random points with a central valley limited to '10'.
        // Change the '>10?10' for another value to change the depth
        for(j=0;j++<N;)
            k=j-N/2,
            h=N/abs(k),
            p.push({x: k*N + W*sin(B*f), y:(random()/2+.3*(h>10?10:h))*1050-Q, z: F+B * N, c:0})
        

        // smooth the points with it's 3 close neighbours.
        // this proces is done 3 times, otherwise results are too rough
        for(Z=3;--Z;)
            for(j=0;B>1&&j<N;)
                k=A-N+j++,
                p[k].y=(p[k].y + p[k-1].y + p[k-N].y)/3,

                // assign color index based on height
                p[k].c=p[k].y<W?2:p[k].y<Q?0:1
            
    }

    // draw slices terrain from farthest to nearest to do a 'natural'
    // depth sorting
    // alpha goes from 1 (full opacity) on the front layers to 
    // 0 (full transparent) on the back layers
    for(i=A/N-2;i--;) dr(p,i*N,N,N-1,t++,1-i*N/A)

    // if any layer went behind the screen, remove one line of points
    // a new one will be randomly generated on next iteration at the back
    if(Z) p=p.slice(N)

    // draw the balloon, adding 2 iterations vertically to draw the basket
    // or something similar to a basket ;)
    for(;++i<=S;)
        for(n=S;n--;){
            //color would be alternating white/red each vertical stripe
            x=2+n%2

            g=cos(n*f)
            h=cos(n*f+f)
            e=sin(n*f)
            d=sin(n*f+f)
            s=W*sin(i*f)
            b=W*sin(i*f+f)

            //generate the points and draw
            dr([{x:s*g,  y:i*T,   z:s*e+V, c:x},
                {x:s*h,  y:i*T,   z:s*d+V, c:x},
                {x:b*g,  y:i*T+T, z:b*e+V, c:x},
                {x:b*h,  y:i*T+T, z:b*d+V, c:x}],0,2,4,0,1)
        }
}})